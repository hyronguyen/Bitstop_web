import { app } from "../Configs/firestore.js";
import { getStorage } from "firebase/storage"; // Thêm import cho Storage

const storage = getStorage(app);

export default storage;