-- CreateTable
CREATE TABLE "Guardian" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "address" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "StudentProfile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dateOfBirth" DATETIME NOT NULL,
    "gender" TEXT NOT NULL,
    "bloodGroup" TEXT,
    "allergies" TEXT,
    "medicalNotes" TEXT,
    "emergencyContact" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "studentId" INTEGER NOT NULL,
    CONSTRAINT "StudentProfile_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_GuardianToStudentProfile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_GuardianToStudentProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "Guardian" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_GuardianToStudentProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "StudentProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_studentId_key" ON "StudentProfile"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "_GuardianToStudentProfile_AB_unique" ON "_GuardianToStudentProfile"("A", "B");

-- CreateIndex
CREATE INDEX "_GuardianToStudentProfile_B_index" ON "_GuardianToStudentProfile"("B");
