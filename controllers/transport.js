const {Transport} = require("../models")
const { Op , Sequelize } = require('sequelize');
const Joi = require('joi');
const fs = require('fs');
const path = require('path');


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


module.exports.createTransport =async ( req, res)=>{
    const {outputId} = req.params
    const files = req.files || {};  
    const {destination, description, travelPeriod, travelers, dateOfRequest, dateReceived, approver, approvalDate, type, PvNo, cashReceiptNo, checkNo,  claimNumber, accounted, dateAccounted,paymentDate, allowance, beneficiary } = req.body

    console.log(req.body)
    
    try{

            
            const transport = await Transport.create({
              outputId,
              destination,
              description,
              travelPeriod,
              travelers,
              dateOfRequest: dateOfRequest || null,
              dateReceived:  dateReceived || null,
              approver,
              approvalDate: approvalDate || null,
              type,
              PvNo,
              checkNo,
              cashReceiptNo,
              claimNumber,
              accounted,
              dateAccounted : dateAccounted || null,
              paymentDate: paymentDate || null, 
              allowance,
              beneficiary,

              document: files.transport ? `/uploads/transports/${files.transport[0].filename}` : null,
              documentName: files.transport ? files.transport[0].originalname : null,

            });
      
            res.status(201).json({transport});


    }catch(error){
        console.error('Error creating transport entry :', error.message);
    return res.status(500).json({ error: 'Error creating transport entry', details: error.message });
    }
}  




// Get all transport requests
module.exports.getTransports = async (req, res) => {
  const {outputId} = req.params
try {
    const { q, filter, page = 0, size = 10 } = req.query;
    console.log(req.query)
    const pageNumber = parseInt(page);
    const pageSize = parseInt(size);

    // Get the actual column names and types from the Supplier model
    const attributes = Object.entries(Transport.rawAttributes).map(([name, attribute]) => ({
      name,
      type: attribute.type
    }));

    let whereClause = { outputId };
    let query = {where: whereClause};

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

    const transports = await Transport.findAndCountAll(query);

    res.status(200).json({
      content: transports.rows,
      count: transports.count,
      totalPages: Math.ceil(transports.count / pageSize)
    });
  } catch (error) {
    console.error('Error fetching transport entries:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
  };
  
  // Get a single transport request by ID
  module.exports.getTransportById = async (req, res) => {
    try {
      // const transport = await Transport.findByPk(req.params.id);
      const transport = await Transport.findOne({ where: { id: req.params.id } }); 
      if (!transport) {
        return res.status(404).json({ message: 'Transport request not found' });
      }
      res.status(200).json(transport);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Update a transport request
  // module.exports.updateTransport = async (req, res) => {
  //   const { id } = req.params;
  //   const {destination,
  //      description, 
  //      travelPeriod, 
  //      travelers, 
  //      dateOfRequest, 
  //      dateReceived, 
  //      approver, 
  //      approvalDate, 
  //      type, 
  //      PvNo, 
  //      claimNumber, 
  //      accounted, 
  //      dateAccounted,
  //      paymentDate, 
  //      allowance, 
  //      beneficiary 
  //     } = req.body

    
  //   const files = req.files || {};
  //   try {

  //       const transport = await Transport.findOne({where:{ uuid :id}})

  //       if(!transport) return res.status(404).json({error : "Transport entry not found"})

  //       // Helper function to delete old files
  //       const deleteOldFile = (folder, oldFilePath) => {
  //           if (!oldFilePath) return;
  //           const oldFileName = path.basename(oldFilePath);
  //           const oldFileFullPath = path.join(__dirname, `../uploads/${folder}/${oldFileName}`);
    
  //           if (fs.existsSync(oldFileFullPath)) {
  //           fs.unlinkSync(oldFileFullPath);
  //           console.log(`Deleted old file: ${oldFileFullPath}`);
  //           }
  //       };
    
  //       // Handle file updates
  //       if (files.transport && files.transport.length > 0) {
  //           // Delete old invoice
  //           deleteOldFile('transports', transport.document);
  //           transport.document = `/uploads/transports/${files.transport[0].filename}`;
  //           transport.documentName =files.transport[0].originalname
          
  //       }

        
  //       await transport.update({
  //         dateOfRequest: dateOfRequest ||null,
  //         approvalDate: approvalDate || null,
  //         approver: approver,
  //         dateReceived: dateReceived ||null,
  //         travelers: travelers,
  //         description: description,
  //         travelPeriod: travelPeriod,
  //         destination: destination,
  //         // document: files.transport ? `/uploads/transports/${files.transport[0].filename}` : null,
  //         type: type,
  //         PvNo:PvNo,
  //         claimNumber:claimNumber,
  //         allowance: allowance,
  //         accounted:accounted,
  //         dateAccounted:dateAccounted,
  //         paymentDate:paymentDate || null,
  //         beneficiary: beneficiary,
  //         document: transport.document,
  //     documentName:transport.documentName
  //       });
  
       
      


  //       res.status(200).json(transport);

  //   } catch (error) {
  //     console.log(error.message)
  //     res.status(500).json({ error: error.message });
  //   }
  // };



  module.exports.updateTransport = async (req, res) => {
    const { id } = req.params;
    const updates = req.body; // Dynamic object to store only provided updates
    const files = req.files || {};

    try {
        console.log("Received request body:", req.body);

        const transport = await Transport.findOne({ where: { uuid: id } });
        if (!transport) return res.status(404).json({ error: "Transport entry not found" });

        // Helper function to parse dates safely
        const parseDate = (dateString) => {
            if (!dateString) return undefined; // Don't update if not provided
            const parsedDate = new Date(dateString);
            return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
        };

        // Build the update object dynamically
        const updateFields = {};

        if (updates.destination !== undefined) updateFields.destination = updates.destination;
        if (updates.description !== undefined) updateFields.description = updates.description;
        if (updates.travelPeriod !== undefined) updateFields.travelPeriod = updates.travelPeriod;
        if (updates.travelers !== undefined) updateFields.travelers = updates.travelers;
        if (updates.dateOfRequest !== undefined) updateFields.dateOfRequest = parseDate(updates.dateOfRequest);
        if (updates.dateReceived !== undefined) updateFields.dateReceived = parseDate(updates.dateReceived);
        if (updates.approver !== undefined) updateFields.approver = updates.approver;
        if (updates.approvalDate !== undefined) updateFields.approvalDate = parseDate(updates.approvalDate);
        if (updates.type !== undefined) updateFields.type = updates.type;
        if (updates.PvNo !== undefined) updateFields.PvNo = updates.PvNo;
        if (updates.cashReceiptNo !== undefined) updateFields.cashReceiptNo = updates.cashReceiptNo;
        if (updates.checkNo !== undefined) updateFields.checkNo = updates.checkNo;
        if (updates.claimNumber !== undefined) updateFields.claimNumber = updates.claimNumber;
        if (updates.accounted !== undefined) updateFields.accounted = updates.accounted;
        if (updates.dateAccounted !== undefined) updateFields.dateAccounted = parseDate(updates.dateAccounted);
        if (updates.paymentDate !== undefined) updateFields.paymentDate = parseDate(updates.paymentDate);
        if (updates.allowance !== undefined) updateFields.allowance = updates.allowance;
        if (updates.beneficiary !== undefined) updateFields.beneficiary = updates.beneficiary;

        // Handle file updates
        if (files.transport && files.transport.length > 0) {
            // Remove the previous file if it exists
            if (transport.document) {
                const oldFilePath = path.join(__dirname, '..', 'public', transport.document);
                fs.unlink(oldFilePath, (err) => {
                    if (err) {
                        console.error(`Failed to delete old file: ${oldFilePath}`, err);
                    }
                });
            }

            updateFields.document = `/uploads/transports/${files.transport[0].filename}`;
            updateFields.documentName = files.transport[0].originalname;
        }

        // Apply updates only to the fields that were explicitly provided
        await transport.update(updateFields);

        res.status(200).json(transport);
    } catch (error) {
        console.error("Error updating transport:", error.message);
        res.status(500).json({ error: error.message });
    }
};


  // Delete a transport request
   module.exports.deleteTransport = async (req, res) => {
    try {
      console.log("Deleting transport with UUID:", req.params.id);
      const transport = await Transport.findOne({ where: { id: req.params.id } }); // Use UUID lookup
      if (!transport) {
        return res.status(404).json({ message: "Transport request not found" });
      }
  
      await transport.destroy();
      res.status(204).json({message:"transport deleted successfully"});
    } catch (error) {
      console.error("Error deleting transport:", error.message);
      res.status(500).json({ error: error.message });
    }
  };
  // module.exports.deleteTransport = async (req, res) => {
  //   try {
  //     console.log("Received ID for deletion:", req.params.id);
  
  //     const transport = await Transport.findOne({ where: { uuid: req.params.id } });
  
  //     if (!transport) {
  //       console.log("Transport not found in DB for UUID:", req.params.id);
  //       return res.status(404).json({ message: "Transport request not found" });
  //     }
  
  //     await transport.destroy();
  //     console.log("Transport successfully deleted:", req.params.id);
  
  //     return res.status(200).json({ message: "Transport deleted successfully" });
  //   } catch (error) {
  //     console.error("Error deleting transport:", error.message);
  //     res.status(500).json({ error: error.message });
  //   }
  // };
  
  