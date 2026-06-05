
/** @type {import('@sveltejs/kit').Reroute} */
export function reroute({ url }) {
  const hostname = url.hostname;
  const subdomain = hostname.split('.')[0];

  if (subdomain !== "localhost" && subdomain !== "codetoy") {
    const path = url.pathname.slice(1);
    const fullpath = `/${subdomain}/${path}`

    console.log("subdomain", subdomain)
    console.log("fullpath", fullpath)

    // visiting 'admin.example.com', routes to 'example.com/admin/'
    return fullpath;
  }

  return "/"
}