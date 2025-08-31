

export default function uploadProof( {Document, Deposits}, services = {}) {
  return async function handleUpload(req, res) {

    const username = req.body.username;

    //create the uploads directory if it doesn't exist
    const fs = await import("fs");
    if (!fs.existsSync("./uploads")) {
      fs.mkdirSync("./uploads");
    }

    try {
      if(!req.file) {
        if (req.flash) req.flash('error', 'No file uploaded');
        return res.redirect('/account/user/deposits');
      }   

      // Create a new document entry in the database
      const ext = req.file.originalname.slice(
        req.file.originalname.lastIndexOf(".")
      );
      await Document.create({
        username: username,
        documentName: req.file.filename,
        DocumentType: req.file.mimetype,
        filePath: req.file.path + ext,
      });

    //   console.log(req.file);

      await Deposits.update(
        { filePath: req.file.path },
        { where: { username: username }, order: [['createdAt', 'DESC']], limit: 1 }
      );

      if (req.flash) req.flash('success', 'Document uploaded successfully');
      if (req.flash) req.flash('error', 'Document upload failed');
      return res.redirect('/account/user/deposits');
    } catch (dbErr) {
      console.error("Database error:", dbErr);
      if (req.flash) req.flash('error', 'Database error');
      return res.redirect('/account/user/deposits');
    }
  };
}
