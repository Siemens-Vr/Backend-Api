const { Procurement } = require('../models');
const validateSupplier = require('../validation/supplierValidation');
const { Op , Sequelize } = require('sequelize');
const { upload } = require('../middleware/fileUploadMiddleware');
const Joi = require('joi');
const fs = require('fs');
const path = require('path');
const { message } = require('../validation/documentValidation');


const uuidSchema = Joi.string()
  .guid({ version: ['uuidv4'] })
  .required()
  .messages({
    'string.base': 'UUID must be valid.',
    'string.guid': 'UUID must be a valid UUID.',
    'any.required': 'UUID is required.'
  });

function getOperatorForType(type, value) {
  if (type instanceof Sequelize.STRING) {
    return { [Op.iLike]: `%${value}%` };
  } else if (type instanceof Sequelize.INTEGER || type instanceof Sequelize.FLOAT || type instanceof Sequelize.DOUBLE) {
    const numValue = parseFloat(value);
    return isNaN(numValue) ? { [Op.eq]: null } : numValue;
  } else if (type instanceof Sequelize.BOOLEAN) {
    return value.toLowerCase() === 'true';
  } else if (type instanceof Sequelize.DATE) {
    return { [Op.eq]: new Date(value) };
  }
  // For other types, use equality
  return { [Op.eq]: value };
}

function isSearchableType(type) {
  return type instanceof Sequelize.STRING ||
         type instanceof Sequelize.INTEGER ||
         type instanceof Sequelize.FLOAT ||
         type instanceof Sequelize.DOUBLE ||
         type instanceof Sequelize.BOOLEAN ||
         type instanceof Sequelize.DATE;
}
module.exports.getProcurements = async (req, res) => {
  const { outputId } = req.params;
  try {
    const { q, filter, page = 0, size = 10 } = req.query;
    const pageNumber = parseInt(page);
    const pageSize = parseInt(size);

    // Get the actual column names and types from the Procurement model
    const attributes = Object.entries(Procurement.rawAttributes).map(([name, attribute]) => ({
      name,
      type: attribute.type
    }));

    let whereClause = { outputId }; // Ensure we filter by outputtId
    let query = { where: whereClause };

    if (q) {
      if (filter && filter !== 'all' && attributes.some(attr => attr.name === filter)) {
        // If a specific filter is provided and it exists in the model
        const attribute = attributes.find(attr => attr.name === filter);
        whereClause[filter] = getOperatorForType(attribute.type, q);
      } else {
        // If no specific filter or 'all', search in all searchable fields
        whereClause[Op.or] = attributes
          .filter(attr => isSearchableType(attr.type))
          .map(attr => ({
            [attr.name]: getOperatorForType(attr.type, q)
          }));
      }
      query.where = whereClause;
    }

    // Always apply pagination and sorting
    query.order = [['createdAt', 'DESC']];
    query.limit = pageSize;
    query.offset = pageNumber * pageSize;

    const procurements = await Procurement.findAndCountAll(query);

    res.status(200).json({
      content: procurements.rows,
      count: procurements.count,
      totalPages: Math.ceil(procurements.count / pageSize)
    });
  } catch (error) {
    console.error('Error fetching procurements:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


module.exports.createProcurement = async (req, res) => {
  // console.log(req.files);
  console.log(req.body)
  const {outputId} = req.params
  const { suppliers,itemName,  itemDescription, amountClaimed, approver, dateTakenToApprover, dateTakenToFinance, type, PvNo, claimNumber, accounted, dateAccounted,  invoiceDate, paymentDate, approvalDate } = req.body;
  const files = req.files || {};  


  try {

    // Create Supplier with file paths directly in the table
    const supplier = await Procurement.create({
      outputId,
      itemName,
      suppliers,
      itemDescription,
      amountClaimed,
      approver,
      dateTakenToApprover: dateTakenToApprover || null,
      approvalDate: approvalDate || null,
      paymentDate: paymentDate || null,
      invoiceDate: invoiceDate || null,
      dateTakenToFinance: dateTakenToFinance || null,
      type,
      claimNumber,
      PvNo,
      accounted,
      dateAccounted: dateAccounted || null,
      // approval,
      // payment,
      // invoice,

      // Add file paths and names if present
      document: files.procurement ? `/uploads/procurements/${files.procurement[0].filename}` : null,
     documentName: files.procurement ? files.procurement[0].originalname : null,
      

    });

    // Respond with the created supplier
    return res.status(201).json({ supplier });
  } catch (error) {
    console.error('Error creating supplier:', error.message);
    return res.status(500).json({ error: 'Error creating supplier', details: error.message });
  }
};


module.exports.getProcurementById = async (req, res) => {
  const { id } = req.params;

  try {
    const supplier = await Procurement.findOne({  where: { uuid: id }, });
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.status(200).json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.updateProcurement = async (req, res) => {
  const { id } = req.params;
  const files = req.files || {};
  const {
    itemName,
    suppliers,
    itemDescription,
    amountClaimed,
    approver,
    dateTakenToApprover,
    dateTakenToFinance,
    type,
    PvNo,
    claimNumber,
    accounted,
    dateAccounted,

    invoiceDate,
    paymentDate,
    approvalDate,
  } = req.body;

  try {
    const supplier = await Procurement.findOne({ where: { uuid: id } });

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    // Helper function to delete old files
    const deleteOldFile = (folder, oldFilePath) => {
      if (!oldFilePath) return;
      const oldFileName = path.basename(oldFilePath);
      const oldFileFullPath = path.join(__dirname, `../uploads/${folder}/${oldFileName}`);

      if (fs.existsSync(oldFileFullPath)) {
        fs.unlinkSync(oldFileFullPath);
        console.log(`Deleted old file: ${oldFileFullPath}`);
      }
    };

    // Handle file updates
    if (files.procurement && files.procurement.length > 0) {
      // Delete old procurement
      deleteOldFile('procurements', supplier.document);
      supplier.document = `/uploads/procurements/${files.procurement[0].filename}`;
      supplier.documentName = files.procurement[0].originalname;
    }

   
    // Update supplier details
    await supplier.update({
      itemName: itemName || supplier.itemName,
      suppliers: suppliers || supplier.suppliers,
      itemDescription: itemDescription || supplier.itemDescription,
      amountClaimed: amountClaimed || supplier.amountClaimed,
      approver: approver || supplier.approver,
      dateTakenToApprover: dateTakenToApprover || supplier.dateTakenToApprover,
      dateTakenToFinance: dateTakenToFinance || supplier.dateTakenToFinance,
      type: type || supplier.type,
      PvNo: PvNo || supplier.PvNo,
      claimNumber: claimNumber || supplier.claimNumber,
      accounted: accounted !== undefined ? accounted : supplier.accounted,
      dateAccounted: dateAccounted || supplier.dateAccounted,
      invoiceDate: invoiceDate || supplier.invoiceDate,
      paymentDate: paymentDate || supplier.paymentDate,
      approvalDate: approvalDate || supplier.approvalDate,
      document: supplier.document,
      documentName:supplier.documentName
  
    });

    res.status(200).json({ message: "Supplier information successfully updated" });
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ error: 'Error updating supplier', details: error.message });
  }
};

// module.exports.search = async (req, res) => {
//    try {
//     const { PvNo, claimNumber, amountClaimed, suppliers , itemName} = req.query;
//     console.log(req.body);
//     const conditions = {};

//     if (PvNo) conditions.PvNo = { [Op.like]: `%${PvNo}%` };
//     if (claimNumber) conditions.claimNumber = { [Op.like]: `%${claimNumber}%` };
//     if (amountClaimed) conditions.amountClaimed = amountClaimed;
//     if (suppliers) conditions.suppliers = { [Op.like]: `%${suppliers}%` };
//     if (itemName) conditions.itemName = { [Op.like]: `%${itemName}%` };

//     const foundSuppliers = await Procurement.findAll({ where: conditions });

//     res.status(200).json(foundSuppliers);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }

//  };



 

// module.exports.deleteProjectProcurement = async (req, res)=>{
//   console.log("You bitches")
// }

module.exports.filter = (req, res) => {
  console.log("Hello, World!"); // Prints to the console
  res.status(200).json({ message: "Hello, World!" }); // Sends response to the user
};



module.exports.deleteProcurement= async (req, res) => {
  const { id } = req.params;
console.log(id)
console.log("running")
  try {
    const procurement = await Procurement.findOne({ where: { uuid: id } });

    if (!procurement) {
      return res.status(404).json({ message: 'Procurement not found' });
    }

    // Helper function to delete files
    const deleteOldFile = (folder, oldFilePath) => {
      if (!oldFilePath) return;
      const oldFileName = path.basename(oldFilePath);
      const oldFileFullPath = path.join(__dirname, `../uploads/${folder}/${oldFileName}`);

      // Check if file exists before deleting
      if (fs.existsSync(oldFileFullPath)) {
        fs.unlinkSync(oldFileFullPath);
        console.log(`Deleted file: ${oldFileFullPath}`);
      } else {
        console.log(`File not found: ${oldFileFullPath}`);
      }
    };

    // Delete associated files
    if (procurement.document) {
      deleteOldFile('procurements', procurement.document);
    }

    // Delete the procurement record
    await procurement.destroy();

    return res.status(200).json({ message: "Procurement record and associated files successfully deleted" });
  } catch (error) {
    console.error('Error deleting Procurement:', error);
    return res.status(500).json({ error: 'Error deleting Procurement', details: error.message });
  }
};