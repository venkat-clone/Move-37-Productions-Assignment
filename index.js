import serverless from "serverless-http";
import expressApp from "app.js";  // import configured Express app

export default serverless(expressApp);
