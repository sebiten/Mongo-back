import Usuario from "../models/Usuario.js";
import gererarId from "../helpers/generarId.js";

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
  const usuario = await Usuario.findOne({email})
  console.log(usuario);

 // comprobar si esta confirmado
}
export { registrar, autenticar };
