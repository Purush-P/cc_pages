export async function onRequestPost(context) {
  try {
    const body = await context.request.text();

    const response = await fetch("https://xght46s8sg.execute-api.eu-west-1.amazonaws.com/WaspInterface", {
      method: "POST",
      headers: {
        "content-type": "text/xml; charset=utf-8",
        "x-api-key": "dSXhnIPUsfmEGbwC0DrNw8yzdPEYuF3m",
        "SOAPAction": "addSubscription"
      },
      body
    });

    const text = await response.text();

    return new Response(text, {
      headers: {
        "Content-Type": "text/xml",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (err) {
    return new Response("Worker Error", { status: 500 });
  }
}