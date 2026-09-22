IF EXISTS (
    SELECT 1
    FROM sys.check_constraints
    WHERE name = 'CHK_interacciones_tipo'
      AND parent_object_id = OBJECT_ID('dbo.interacciones')
)
BEGIN
    ALTER TABLE dbo.interacciones
    DROP CONSTRAINT CHK_interacciones_tipo;
END;

ALTER TABLE dbo.interacciones
ADD CONSTRAINT CHK_interacciones_tipo
CHECK ([tipo] IN ('reunión', 'correo', 'llamada', 'petición'));