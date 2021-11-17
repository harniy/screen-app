import captureWebsite from "capture-website";
import express from "express";
import fs from 'fs'
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 7000

const options = {
  width: 1920,
  height: 1080,
  type: 'jpeg',
};

async function getImage(url) {
  const hash = String(Date.now()).slice(-5);
  const screenName = `screenshot${hash}.jpeg`

  try {
    await captureWebsite.file(`${url}`, screenName, options);
  } catch (error) {
    console.log(error);
  }

  return screenName
}

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

app.post("/screenshot", async (req, res) => {
  const { url } = req.body;

  try {
    const screenName = await getImage(url)

      const img = await base64_encode(screenName)
  
      /* delete image from server */
      setTimeout(() => {
      fs.unlinkSync(screenName)
      }, 1000)
  
      res.json({img})
  }catch(err){
    console.log(err)
  }

  });

app.listen(PORT, function () {
  console.log(`Server START on PORT: ${PORT}`);
});
