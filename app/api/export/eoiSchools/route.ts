import { NextRequest } from "next/server";
import { EoiSchool } from "@/utils/models/eoischool";
import { pipeline, Readable } from "stream";
import { PassThrough } from "stream";
import { format } from "fast-csv";
import { connectDB } from "@/utils/config/dbConfig";
const districtsMap: Record<string, string> = {
   "01" : "Agra",
   "02": "Aligarh" ,
   "03": "Allahabad" ,
   "04": "Almora" ,
   "05": "Ambedkar Nagar",
   "06": "Amethi" ,
   "07": "Amroha" ,
   "08": "Ara" ,
   "09": "Araria" ,
   "10": "Arwal" ,
   "11": "Auraiya" ,
   "12": "Aurangabad" ,
   "13": "Ayodhya" ,
   "14": "Azamgarh" ,
   "15": "Badaun" ,
   "16": "Bageshwar" ,
   "17": "Baghpat" ,
   "18": "Bahraich" ,
   "19": "Ballia" ,
   "20": "Balrampur" ,
   "21": "Banda" ,
   "22": "Banka" ,
   "23": "Barabanki" ,
   "24": "Bareilly" ,
   "25": "Basti" ,
   "26": "Begusarai" ,
   "27": "Bettiah" ,
   "28": "Bhadohi" ,
   "29": "Bhagalpur" ,
   "30": "Biharsharif" ,
   "31": "Bijnor" ,
   "32": "Bokaro" ,
   "33": "Bulandshahr" ,
   "34": "Buxar" ,
   "35": "Chamoli" ,
   "36": "Champawat" ,
   "37": "Chandauli" ,
   "38": "Chapra" ,
   "39": "Chatra" ,
   "40": "Chitrakoot" ,
   "41": "Darbhanga" ,
   "42": "Dehradun" ,
   "43": "Deoghar" ,
   "44": "Deoria" ,
   "45": "Dhanbad" ,
   "46": "Dumka" ,
   "47": "East Singhbhum",
   "48": "Etah" ,
   "49": "Etawah" ,
   "50": "Farrukabad" ,
   "51": "Fatehpur" ,
   "52": "Firozabad" ,
   "53": "Gangapar" ,
   "54": "Garhwa" ,
   "55": "Gaya" ,
   "56": "Ghazipur" ,
   "57": "Giridih" ,
   "58": "Godda" ,
   "59": "Gonda" ,
   "60": "Gopalganj" ,
   "61": "Gorakhpur" ,
   "62": "Gumla" ,
   "63": "Hajipur" ,
   "64": "Haldwani" ,
   "65": "Hamirpur" ,
   "66": "Hapur" ,
   "67": "Hardoi" ,
   "68": "Haridwar" ,
   "69": "Hathras" ,
   "70": "Hazaribagh" ,
   "71": "Jalaun" ,
   "72": "Jamtara" ,
   "73": "Jamui" ,
   "74": "Jaunpur" ,
   "75": "Jehanabad" ,
   "76": "Jhansi" ,
   "77": "Kaimur" ,
   "78": "Kannauj" ,
   "79": "Kanpur City",
   "153": "Kanpur Dehat",
   "80": "Kasganj" ,
   "81": "Katihar" ,
   "82": "Kaushambi" ,
   "83": "Khagaria" ,
   "84": "Khunti" ,
   "85": "Kishanganj" ,
   "86": "Kodarma" ,
   "87": "Kushinagar" ,
   "88": "Lakhimpur Kheri",
   "89": "Lakhisarai" ,
   "90": "Lalitpur" ,
   "91": "Latehar" ,
   "92": "Lohardaga" ,
   "93": "Lucknow" ,
   "94": "Madhepura" ,
   "95": "Madhubani" ,
   "96": "Maharajganj" ,
   "97": "Mahoba" ,
   "98": "Mainpuri" ,
   "99": "Mathura" ,
   "100": "Mau" ,
   "101": "Meerut" ,
   "102": "Mirzapur" ,
   "103": "Moradabad" ,
   "104": "Motihari" ,
   "105": "Munger" ,
   "106": "Muzaffarpur" ,
   "107": "Muzzafarnagar" ,
   "108": "Nainital" ,
   "109": "Nawada" ,
   "110": "Pakur" ,
   "111": "Palamu" ,
   "112": "Patna" ,
   "113": "Pauri Garhwal",
   "114": "Pilibhit" ,
   "115": "Pithoragarh" ,
   "116": "Pratapgarh" ,
   "117": "Purnea" ,
   "118": "Rae Bareli",
   "119": "Ramgarh" ,
   "120": "Rampur" ,
   "121": "Ranchi" ,
   "122": "Rishikesh" ,
   "123": "Rohtas" ,
   "124": "Roorkee" ,
   "125": "Rudraprayag" ,
   "126": "Saharanpur" ,
   "127": "Saharsa" ,
   "128": "Sahibganj" ,
   "129": "Samastipur" ,
   "130": "Sambhal" ,
   "131": "Sant Kabir r",
   "132": "Saraikela-Kharsawan",
   "133": "Shravasti" ,
   "134": "Shahjahanpur" ,
   "135": "Shamli" ,
   "136": "Sheikhpura" ,
   "137": "Sheohar" ,
   "138": "Siddhartha nagar",
   "139": "Simdega" ,
   "140": "Sitamarhi" ,
   "141": "Sitapur" ,
   "142": "Siwan" ,
   "143": "Sonbhadra" ,
   "144": "Sultanpur" ,
   "145": "Supaul" ,
   "146": "Tehri Garhwal",
   "147": "Udham Singh r",
   "148": "Unnao" ,
   "149": "Uttarkashi" ,
   "150": "Varanasi" ,
   "151": "Vikas Nagar",
   "152": "West Singhbhum",
};

connectDB().catch(console.error);
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const headers = req.headers;
  const authorization = headers.get("authorization");

  if (!authorization) {
    return new Response(JSON.stringify({ error: "Authorization header required" }), {
      status: 400,
    });
  }

  const token = authorization.split(" ")[0]; // ✅ Correct Bearer token handling
  if (!token || token.length !== 24) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const search = searchParams.get("search") || "";
  const query: any = {};

  if (search) {
    const searchRegex = new RegExp(search, "i");
    query.$or = [
      { schoolName: searchRegex },
      { schoolAddress: searchRegex },
      { district: searchRegex },
      { region: searchRegex },
    ];
  }

  const cursor = EoiSchool.find(query).cursor();

  const csvStream = format({ headers: true });
  const passthrough = new PassThrough();

  pipeline(csvStream, passthrough, (err) => {
    if (err) console.error("Pipeline failed", err);
  });

  (async () => {
    for await (const eoiSchool of cursor) {
      csvStream.write({
        schoolName: eoiSchool.schoolName,
        schoolCoordinatorContact: eoiSchool.schoolCoordinatorContact,
        schoolAddress: eoiSchool.schoolAddress,
        district: districtsMap[eoiSchool.district] || eoiSchool.district, // ✅ map code to name
        region: eoiSchool.region,
      });
    }
    csvStream.end();
  })();

  return new Response(Readable.toWeb(passthrough) as ReadableStream, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=eoischools.csv`, // ✅ renamed
    },
  });
}
