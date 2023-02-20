import Usuario from "../models/Usuario.js";
import gererarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";


const registrar = async (req, res) => {
  // evitar reg duplicados

  const { email } = req.body;
  const existeUsuario = await Usuario.findOne({
    email,
  });
  if (existeUsuario) {
    const error = new Error("Usuario ya registrado");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const usuario = new Usuario(req.body);
    usuario.token = gererarId();
    const usuarioAlmacenado = await usuario.save();
    res.json(usuarioAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const autenticar = async (req, res) => {

  const {email, password} = req.body
 // Comprobar si el usurio existe
  const usuario = await Usuario.findOne({email});
  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message })
  }
 // comprobar si esta confirmado
  if (!usuario.confirmado) {
    const error = new Error("El usuario no esta confirmado");
    return res.status(403).json({ msg: error.message})
  }
  // comprobar el password
  if (!usuario.comprobarPassword(password)) {
    const error = new Error("El password es incorrecto");
    return res.status(403).json({ msg: error.message })
  }
  // generar el JWT
  const token = generarJWT(usuario._id);
  res.json(
    {
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token
    }
  )
};
export { registrar, autenticar };
