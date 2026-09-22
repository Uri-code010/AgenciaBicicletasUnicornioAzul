IF COL_LENGTH('dbo.interacciones', 'nombre_contacto') IS NULL
    ALTER TABLE dbo.interacciones ADD nombre_contacto NVARCHAR(150) NULL;

IF COL_LENGTH('dbo.interacciones', 'correo_contacto') IS NULL
    ALTER TABLE dbo.interacciones ADD correo_contacto NVARCHAR(150) NULL;

IF COL_LENGTH('dbo.interacciones', 'telefono_contacto') IS NULL
    ALTER TABLE dbo.interacciones ADD telefono_contacto NVARCHAR(30) NULL;

IF EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE object_id = OBJECT_ID('dbo.interacciones')
      AND name = 'cliente_id'
      AND is_nullable = 0
)
    ALTER TABLE dbo.interacciones ALTER COLUMN cliente_id INT NULL;

IF EXISTS (
    SELECT 1 FROM sys.check_constraints
    WHERE name = 'CHK_interacciones_tipo'
      AND parent_object_id = OBJECT_ID('dbo.interacciones')
)
    ALTER TABLE dbo.interacciones DROP CONSTRAINT CHK_interacciones_tipo;

ALTER TABLE dbo.interacciones
ADD CONSTRAINT CHK_interacciones_tipo
CHECK ([tipo] IN ('reunión', 'correo', 'llamada', 'petición', 'contacto'));