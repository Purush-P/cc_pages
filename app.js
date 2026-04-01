function handleNo() {
  document.getElementById("result").innerHTML =
    "<span style='color:red;'>Cancelled ❌</span>";
}

async function handleYes() {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "Processing...";

  const soapEndpoint = "/api/soap"; // ✅ IMPORTANT

  const created = new Date().toISOString();
	const nonce = btoa("random123"); // simple base64

	const soapBody = `<?xml version="1.0" encoding="utf-8"?>
	<soapenv:Envelope xmlns:wasp="http://wasp.doi.soap.protocol.cellc.co.za"
					  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
	  <soapenv:Header>
		<wsse:Security soapenv:mustUnderstand="1"
		  xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
		  xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">

		  <wsse:UsernameToken wsu:Id="` + crypto.randomUUID() + `">
			<wsse:Username>mobixone</wsse:Username>
			<wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">ob1xon#</wsse:Password>
			<wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">${nonce}</wsse:Nonce>
			<wsu:Created>${created}</wsu:Created>
		  </wsse:UsernameToken>

		</wsse:Security>
	  </soapenv:Header>

	  <soapenv:Body>
		<wasp:addSubscription>
		  <wasp:msisdn>27791174715</wasp:msisdn>
		  <wasp:serviceName>MOBIXONE PENTHOUSETV</wasp:serviceName>
		  <wasp:contentProvider>MOBIXONE</wasp:contentProvider>
		  <wasp:chargeCode>MOBIXONE0050</wasp:chargeCode>
		  <wasp:chargeInterval>DAYEVENTx5</wasp:chargeInterval>
		  <wasp:contentType>OTHER</wasp:contentType>
		  <wasp:bearerType>WEB</wasp:bearerType>
		  <wasp:waspReference>${crypto.randomUUID()}</wasp:waspReference>
		  <wasp:waspTID>${crypto.randomUUID()}</wasp:waspTID>
		</wasp:addSubscription>
	  </soapenv:Body>
	</soapenv:Envelope>`;
	  `;

  try {
    const res = await fetch(soapEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml"
      },
      body: soapBody
    });

    const text = await res.text();
    console.log("SOAP RESPONSE:", text);

    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");

    const result = xml.querySelector("result")?.textContent;

    if (result === "0") {
      showSuccess(xml);
    } else {
      showFailure(xml);
    }

  } catch (err) {
    console.error(err);
    resultDiv.innerHTML = "Error ❌";
  }
}

function showSuccess(xml) {
  const serviceID = xml.querySelector("serviceID")?.textContent;
  const ref = xml.querySelector("waspReference")?.textContent;
  const tid = xml.querySelector("waspTID")?.textContent;

  document.body.innerHTML = `
    <h2 style="color:green;">Success ✅</h2>
    <p>Service ID: ${serviceID}</p>
    <p>Reference: ${ref}</p>
    <p>TID: ${tid}</p>
  `;
}

function showFailure(xml) {
  const result = xml.querySelector("result")?.textContent;

  document.body.innerHTML = `
    <h2 style="color:red;">Failed ❌</h2>
    <p>Error Code: ${result}</p>
  `;
}