IF COL_LENGTH('dbo.usuarios', 'permisos') IS NULL
    ALTER TABLE dbo.usuarios ADD permisos NVARCHAR(MAX) NULL;

UPDATE dbo.usuarios
SET rol = 'empleado', permisos = '["dashboard:ver","clientes:ver","metricas:ver","solicitudes:ver"]'
WHERE LOWER(correo) = 'empleado@correo.com';