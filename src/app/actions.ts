'use server'

export async function processAdobeLink(userUrl: string) {
  try {
    // 1. Extract 9-10 digit ID
    const idMatch = userUrl.match(/\d{9,10}/);
    
    // 2. Safety check: if no match, return early
    if (!idMatch) return { success: false, error: "Invalid Link" };
    
    // 3. FIX: Access the first element of the match array
    const id = idMatch[0]; 
    
    // 4. Now .substring() will work because 'id' is a string
    const p1 = id.substring(0, 3);
    const p2 = id.substring(3, 6);
    
    // Direct Image CDN Link
    const imgUrl = `https://as1.ftcdn.net/v2/jpg/${p1}/${p2}/1000_F_${id}.jpg`;
    
    return { success: true, id, imgUrl };
  } catch (e) {
    console.error("Link processing error:", e);
    return { success: false, error: "System Error" };
  }
}