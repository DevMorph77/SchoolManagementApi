-- CreateTable
CREATE TABLE "ReportTemplate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "schoolId" INTEGER NOT NULL,
    "createdById" INTEGER NOT NULL,
    CONSTRAINT "ReportTemplate_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReportTemplate_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Report" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "generatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "templateId" INTEGER,
    "schoolId" INTEGER NOT NULL,
    "generatedById" INTEGER NOT NULL,
    "studentId" INTEGER,
    "classId" INTEGER,
    CONSTRAINT "Report_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ReportTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Report_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Report_generatedById_fkey" FOREIGN KEY ("generatedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Report_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Report_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ReportTemplate_schoolId_idx" ON "ReportTemplate"("schoolId");

-- CreateIndex
CREATE INDEX "ReportTemplate_createdById_idx" ON "ReportTemplate"("createdById");

-- CreateIndex
CREATE INDEX "Report_schoolId_idx" ON "Report"("schoolId");

-- CreateIndex
CREATE INDEX "Report_studentId_idx" ON "Report"("studentId");

-- CreateIndex
CREATE INDEX "Report_classId_idx" ON "Report"("classId");

-- CreateIndex
CREATE INDEX "Report_templateId_idx" ON "Report"("templateId");

-- CreateIndex
CREATE INDEX "Report_generatedById_idx" ON "Report"("generatedById");
