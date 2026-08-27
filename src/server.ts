
import "dotenv/config";
import app from "./app";


const PORT = Number(process.env.PORT) ;

app.listen(PORT, () => {
  console.log(
    `🚀 Northstar Small Kenyan Retailers API running on http://localhost:${PORT}`
  );

});