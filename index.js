var admin = require("firebase-admin");
const fs = require("fs");
const lang = require("@indic-transliteration/sanscript");
var serviceAccount = require("./serviceAccountKey1.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const collectionName = "teluguNames";

/** ✅ CREATE: Add a new document */
const addName = async (data) => {
  try {
    const docRef = await db.collection(collectionName).add(data);
    console.log("Document added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document:", error);
  }
};

const uploadNamesAdmin = async (namesArray) => {
  try {
    const batch = db.batch(); // Initialize batch
    const namesRef = db.collection(collectionName); // Replace with your collection name

    // Step 1: Fetch all existing names.telugu from Firestore
    const existingNamesSnapshot = await namesRef.get();
    const existingTeluguNames = new Set(
      existingNamesSnapshot.docs.map((doc) => doc.data().name.telugu)
    );

    const docRefs = [];

    // Step 2: Add only unique names to the batch
    namesArray.forEach((data) => {
      if (!existingTeluguNames.has(data.name.telugu)) {
        const docRef = namesRef.doc(); // Generate document reference
        batch.set(docRef, data); // Add to batch
        docRefs.push(docRef.id);
      } else {
        console.log(`Skipping duplicate: ${data.name.telugu}`);
      }
    });

    // Step 3: Commit batch if there are new unique names
    if (docRefs.length > 0) {
      await batch.commit();
      console.log("All unique documents added successfully:", docRefs);
    } else {
      console.log("No new unique names to add.");
    }

    return docRefs;
  } catch (error) {
    console.error("Error uploading names:", error);
  }
};

/** 🔍 READ: Get a document by ID */
const getNameById = async (docId) => {
  try {
    const doc = await db.collection(collectionName).doc(docId).get();
    if (doc.exists) {
      console.log("Document data:", doc.data());
      return doc.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
  }
};

/** 🔄 UPDATE: Modify an existing document */
const updateName = async (docId, updatedData) => {
  try {
    await db.collection(collectionName).doc(docId).update(updatedData);
    console.log("Document updated:", docId);
  } catch (error) {
    console.error("Error updating document:", error);
  }
};

/** ❌ DELETE: Remove a document */
const deleteName = async (docId) => {
  try {
    await db.collection(collectionName).doc(docId).delete();
    console.log("Document deleted:", docId);
  } catch (error) {
    console.error("Error deleting document:", error);
  }
};

/** 📜 LIST ALL: Get all documents in the collection */
const listAllNames = async () => {
  try {
    const snapshot = await db.collection(collectionName).get();
    let names = [];
    snapshot.forEach((doc) => {
      names.push({ id: doc.id, ...doc.data() });
    });
    console.log("All Names:", names);
    return names;
  } catch (error) {
    console.error("Error getting documents:", error);
  }
};

/** 🔎 SEARCH: Find by first letter */
const searchByFirstLetter = async (letter) => {
  try {
    const snapshot = await db
      .collection(collectionName)
      .where("first_letter.english", "==", letter) // Change "english" to "telugu" if needed
      .get();

    let results = [];
    snapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });

    console.log(`Names starting with '${letter}':`, results);
    return results;
  } catch (error) {
    console.error("Error searching documents:", error);
  }
};

// Example Usage
(async () => {
  const sampleData = {
    name: { english: "Omkar", telugu: "ఓంకార్" },
    first_letter: { english: "O", telugu: "ఓ" },
    gender: "male",
    language: "telugu",
    religion: "Hindu",
    meanings: { english: "Sacred Sound of Om", telugu: "ఓం పవిత్ర ధ్వని" },
    origin: "Sanskrit",
    tags: ["spiritual", "sacred", "divine"],
  };

  const sampleData2 = [
    {
      name: { english: "Omkar", telugu: "ఓంకార్" },
      first_letter: { english: "O", telugu: "ఓ" },
      gender: "male",
      language: "telugu",
      religion: "Hindu",
      meanings: { english: "Sacred Sound of Om", telugu: "ఓం పవిత్ర ధ్వని" },
      origin: "Sanskrit",
      tags: ["spiritual", "sacred", "divine"],
    },
  ];

  // Add a new name
  //   const docId = await addName(sampleData);
  let files = fs.readdirSync("./data/transformedData/girlNames");
  for(let file of files){
    await new Promise(resolve => setTimeout(resolve, 1000));
    let rawData = fs.readFileSync(`./data/transformedData/girlNames/${file}`, "utf-8"); // 
    let namesArray = JSON.parse(rawData); 
    let docIds = await uploadNamesAdmin(namesArray);
    // Parse JSON
  // Read file

  }

  //   // Get the document
  //   await getNameById("7saZOIugIrn0lFQ2bwT8");

  //   // Update the document
  //   await updateName(docId, { origin: "Updated Sanskrit" });

  //   // List all names
  //   await listAllNames();

  //   // Search by first letter
  //   await searchByFirstLetter("O");

  //   // Delete the document
  //   await deleteName(docId);
})();

// console.log(lang.t("Ankita", "hk", "devanagari"));
