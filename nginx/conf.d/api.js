function getReponse(r) {
    r.return(200, "Success!");
}

function generate_hs256_jwt(claims, key, valid) {
    var header = { typ: "JWT",  alg: "HS256" };
    var claims = Object.assign(claims, {exp: Math.floor(Date.now()/1000) + valid});

    var s = [header, claims].map(JSON.stringify)
                            .map(v=>v.toString('base64url'))
                            .join('.');

    var h = require('crypto').createHmac('sha256', key);

    return s + '.' + h.update(s).digest('base64url');
}

function jwt(r) {
    var claims = {
        iss: "nginx",
        sub: "alice",
        foo: 123,
        bar: "qq",
        zyx: false,
        realm_access: {
            roles: ["admin", "test"]
        }
    };

    return generate_hs256_jwt(claims, 'foo', 600);
}

export default {getReponse, jwt};