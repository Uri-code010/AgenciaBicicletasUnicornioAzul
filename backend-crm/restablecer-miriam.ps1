$securePassword = Read-Host "Nueva contraseña para Miriam (mínimo 8 caracteres)" -AsSecureString
$pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)

try {
    $env:RESET_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
    node -e "const bcrypt=require('bcrypt'); require('dotenv').config(); const {getPool,sql}=require('./config/Db'); (async()=>{const password=process.env.RESET_PASSWORD; if(!password || password.length<8) throw new Error('La contraseña debe tener al menos 8 caracteres.'); const hash=await bcrypt.hash(password,10); const pool=await getPool(); const result=await pool.request().input('correo',sql.NVarChar(150),'miriam@correo.com').input('password_hash',sql.NVarChar(255),hash).query('UPDATE usuarios SET password_hash=@password_hash WHERE LOWER(correo)=LOWER(@correo)'); console.log('Contraseña actualizada. Filas modificadas: '+result.rowsAffected[0]);})().catch(error=>{console.error(error.message); process.exitCode=1;});"
}
finally {
    Remove-Item Env:RESET_PASSWORD -ErrorAction SilentlyContinue
    if ($pointer) {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
    }
}
