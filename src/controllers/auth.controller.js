

export async function register(req, res, next) {

  res.json({message: 'Register service'})
}

export async function login(req, res, next) {

  res.json({message: 'Login service'})
}

export async function getMe(req, res, next) {
  
  res.json({message: 'Getme service'})
}