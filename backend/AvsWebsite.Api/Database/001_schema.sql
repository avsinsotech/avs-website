/* =====================================================================
   AVS InSoTech – Corporate Website database (Microsoft SQL Server 2016+)
   Idempotent: safe to run more than once.
   ===================================================================== */
SET NOCOUNT ON;
GO

/* ---------- Website enquiries / leads ---------- */
IF OBJECT_ID('dbo.Leads','U') IS NULL
CREATE TABLE dbo.Leads (
    Id               BIGINT IDENTITY(1,1)  NOT NULL CONSTRAINT PK_Leads PRIMARY KEY,
    FormType         VARCHAR(20)           NOT NULL,          -- contact | demo | product
    Name             NVARCHAR(100)         NOT NULL,
    Organisation     NVARCHAR(150)         NOT NULL,
    Designation      NVARCHAR(100)         NOT NULL,
    Mobile           VARCHAR(15)           NOT NULL,
    Email            NVARCHAR(150)         NOT NULL,
    InstitutionType  NVARCHAR(100)         NOT NULL,
    ProductInterest  NVARCHAR(200)         NULL,
    Message          NVARCHAR(2000)        NULL,
    Status           VARCHAR(20)           NOT NULL CONSTRAINT DF_Leads_Status DEFAULT('New'),
    Notes            NVARCHAR(4000)        NULL,
    ConsentGiven     BIT                   NOT NULL,
    ConsentAt        DATETIME2(0)          NOT NULL,
    SourcePage       NVARCHAR(300)         NULL,
    IpAddress        VARCHAR(45)           NULL,
    UserAgent        NVARCHAR(400)         NULL,
    EmailSent        BIT                   NOT NULL CONSTRAINT DF_Leads_EmailSent DEFAULT(0),
    CreatedAt        DATETIME2(0)          NOT NULL CONSTRAINT DF_Leads_CreatedAt DEFAULT(SYSUTCDATETIME()),
    UpdatedAt        DATETIME2(0)          NULL,
    CONSTRAINT CK_Leads_FormType CHECK (FormType IN ('contact','demo','product')),
    CONSTRAINT CK_Leads_Status   CHECK (Status IN ('New','Contacted','Demo Scheduled','Qualified','Closed')),
    CONSTRAINT CK_Leads_Consent  CHECK (ConsentGiven = 1)
);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Leads_CreatedAt')
    CREATE INDEX IX_Leads_CreatedAt ON dbo.Leads (CreatedAt DESC) INCLUDE (Status, FormType);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Leads_Status')
    CREATE INDEX IX_Leads_Status ON dbo.Leads (Status, CreatedAt DESC);
GO

/* ---------- CMS content (products, categories, solutions, articles, faqs, media) ---------- */
IF OBJECT_ID('dbo.ContentItems','U') IS NULL
CREATE TABLE dbo.ContentItems (
    Id           INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_ContentItems PRIMARY KEY,
    ContentType  VARCHAR(30)       NOT NULL,
    Slug         VARCHAR(150)      NULL,
    Title        NVARCHAR(300)     NOT NULL,
    SortOrder    INT               NOT NULL CONSTRAINT DF_ContentItems_Sort DEFAULT(0),
    IsPublished  BIT               NOT NULL CONSTRAINT DF_ContentItems_Pub DEFAULT(1),
    DataJson     NVARCHAR(MAX)     NOT NULL,
    CreatedAt    DATETIME2(0)      NOT NULL CONSTRAINT DF_ContentItems_Created DEFAULT(SYSUTCDATETIME()),
    UpdatedAt    DATETIME2(0)      NULL,
    UpdatedBy    NVARCHAR(150)     NULL,
    CONSTRAINT CK_ContentItems_Type CHECK (ContentType IN ('products','categories','solutions','articles','faqs','media')),
    CONSTRAINT CK_ContentItems_Json CHECK (ISJSON(DataJson) = 1)
);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UX_ContentItems_TypeSlug')
    CREATE UNIQUE INDEX UX_ContentItems_TypeSlug ON dbo.ContentItems (ContentType, Slug) WHERE Slug IS NOT NULL;
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ContentItems_TypePub')
    CREATE INDEX IX_ContentItems_TypePub ON dbo.ContentItems (ContentType, IsPublished, SortOrder);
GO

/* ---------- Site settings (homepage, company, seo) ---------- */
IF OBJECT_ID('dbo.SiteSettings','U') IS NULL
CREATE TABLE dbo.SiteSettings (
    GroupKey   VARCHAR(30)   NOT NULL CONSTRAINT PK_SiteSettings PRIMARY KEY,
    ValueJson  NVARCHAR(MAX) NOT NULL CONSTRAINT CK_SiteSettings_Json CHECK (ISJSON(ValueJson) = 1),
    UpdatedAt  DATETIME2(0)  NOT NULL CONSTRAINT DF_SiteSettings_Updated DEFAULT(SYSUTCDATETIME()),
    UpdatedBy  NVARCHAR(150) NULL
);
GO

/* ---------- Admin users ---------- */
IF OBJECT_ID('dbo.AdminUsers','U') IS NULL
CREATE TABLE dbo.AdminUsers (
    Id              INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_AdminUsers PRIMARY KEY,
    Name            NVARCHAR(100)     NOT NULL,
    Email           NVARCHAR(150)     NOT NULL CONSTRAINT UX_AdminUsers_Email UNIQUE,
    PasswordHash    VARCHAR(200)      NOT NULL,       -- PBKDF2-SHA256
    Role            VARCHAR(20)       NOT NULL CONSTRAINT DF_AdminUsers_Role DEFAULT('Admin'),
    IsActive        BIT               NOT NULL CONSTRAINT DF_AdminUsers_Active DEFAULT(1),
    FailedAttempts  INT               NOT NULL CONSTRAINT DF_AdminUsers_Failed DEFAULT(0),
    LockoutUntil    DATETIME2(0)      NULL,
    LastLoginAt     DATETIME2(0)      NULL,
    CreatedAt       DATETIME2(0)      NOT NULL CONSTRAINT DF_AdminUsers_Created DEFAULT(SYSUTCDATETIME())
);
GO

/* ---------- Audit log ---------- */
IF OBJECT_ID('dbo.AuditLog','U') IS NULL
CREATE TABLE dbo.AuditLog (
    Id         BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_AuditLog PRIMARY KEY,
    UserEmail  NVARCHAR(150) NOT NULL,
    Action     VARCHAR(40)   NOT NULL,
    Entity     VARCHAR(40)   NOT NULL,
    EntityId   NVARCHAR(400) NULL,
    At         DATETIME2(0)  NOT NULL CONSTRAINT DF_AuditLog_At DEFAULT(SYSUTCDATETIME())
);
GO
