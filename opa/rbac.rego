package httpapi.rbac

import input as req

import data.roles

default allow = false

allow {
  # check role
  role := req.user[_]
  user_roles = roles[role]

  # check route
  user_roles[k]
  glob.match(k, [], req.path)

  # check method
  user_roles[k][_] = req.method
}