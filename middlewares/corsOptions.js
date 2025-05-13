// middlewares/corsOptions.js
const corsOptions = {
    origin: ["http://localhost:3000"], // autorise ton frontend React local
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  };
  
  export default corsOptions;
  