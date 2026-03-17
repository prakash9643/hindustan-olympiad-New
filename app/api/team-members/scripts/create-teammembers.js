const axios = require("axios");

const teamMembers = [
  { name: "ishan sharma", email: "ishan.sharma@livehindustan.com", phone: "9654411117", region: "1,2,3,4,5", role: "admin" },
  // { name: "Deepesh mehra", email: "deepesh.mehra@livehindustan.com", phone: "7607977777", region: "1", role: "finance" },
  // { name: "Chanakya Sharma", email: "", phone: "8709829193", region: "3", role: "finance" },
  // { name: "Pramod Kumar", email: "", phone: "9470025727", region: "3", role: "finance" },

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
