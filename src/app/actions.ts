'use server'

export async function processAdobeLink(userUrl: string) {
  try {
    // Extract 9-10 digit ID
    const idMatch = userUrl.match(/\d{9,10}/);
    if (!idMatch) return { success: false, error: "Invalid Link" };
    
    const id = idMatch;
    const p1 = id.substring(0, 3);
    const p2 = id.substring(3, 6);
    
    // Direct Image CDN Link
    const imgUrl = `https://as1.ftcdn.net/v2/jpg/${p1}/${p2}/1000_F_${id}.jpg`;
    
    return { success: true, id, imgUrl };
  } catch (e) {
    return { success: false, error: "System Error" };
  }
}