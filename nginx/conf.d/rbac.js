function authz(req, res) {
  // get roles
  var roles = jwt_payload_roles(req)
  if(roles == null) {
    req.return(401);
    return;
  }

  var opa_data = {
    "input": {
      "user": roles,
      "path": req.variables.request_uri,
      "method": req.variables.request_method
    }
  };

  var opts = {
    method: "POST",
    body: JSON.stringify(opa_data)
  };

  req.subrequest("/_opa", opts, function(opa) {
    req.error("OPA response: " + opa.responseBody);

    var body = JSON.parse(opa.responseBody);
    if (!body.result)  {
      req.return(403);
      return;
    }

    if (!body.result.allow) {
      req.return(403);
      return;
    } else {
      req.return(200);
    }
  });
}

function jwt(data) {
  var parts = data.split('.').slice(0,2)
      .map(v=>Buffer.from(v, 'base64url').toString())
      .map(JSON.parse);
  return { headers:parts[0], payload: parts[1] };
}

function jwt_payload_roles(r) {
  if (r.headersIn.Authorization == null) {
    return
  }

  return jwt(r.headersIn.Authorization.slice(7)).payload.realm_access.roles;
  // when the token is provided as the "myjwt" argument
  // return jwt(r.args.myjwt).payload.sub;
}

export default {authz};