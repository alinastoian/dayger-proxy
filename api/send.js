export default async function handler(req, res) {
  // Allow requests from dayger.co.uk and www.dayger.co.uk
  const allowedOrigins = ["https://dayger.co.uk", "https://www.dayger.co.uk"];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight response for OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const body = req.body;

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbwXldkZPwNVrg18oXG8yw20U2wLwF5tLn6ye_xSZGYzbnyWBTbLVTpByTzoFWMTTq_bEg/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const result = await response.text();
    return res.status(200).json({ success: true, response: result });

  } catch (error) {
    console.error("Proxy error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

}
