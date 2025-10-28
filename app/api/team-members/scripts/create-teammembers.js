const axios = require("axios");

const teamMembers = [
  // { name: "Rajeev Kumar", email: "rajeev.kumar1@livehindustan.com", phone: "9718101700", region: "1,2,3,4,5", role: "admin" }, // East UP
  { name: "Manish Shukla", email: "Connextechnmedia@gmail.com", phone: "9873478439", region: "1,2,3,4,5", role: "finance" },

];

async function createTeamMembers() {
  for (const member of teamMembers) {
    try {
      const response = await axios.post("https://www.hindustanolympiad.in/api/team-members", member);
      console.log(`✅ Created: ${member.name}`);
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.error === "Phone number already exists") {
        console.warn(`⚠️ Skipped (already exists): ${member.name}`);
      } else {
        console.error(`❌ Failed to create ${member.name}:`, err.response?.data || err.message);
      }
    }
  }
}

createTeamMembers();
