-- CreateTable
CREATE TABLE "Address" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "evm_address" TEXT NOT NULL,
    "xrpl_address" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Secret" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "evm_address" TEXT NOT NULL,
    "xrpl_address" TEXT NOT NULL,
    "private_key" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Address_evm_address_key" ON "Address"("evm_address");

-- CreateIndex
CREATE UNIQUE INDEX "Address_xrpl_address_key" ON "Address"("xrpl_address");

-- CreateIndex
CREATE UNIQUE INDEX "Secret_evm_address_key" ON "Secret"("evm_address");

-- CreateIndex
CREATE UNIQUE INDEX "Secret_xrpl_address_key" ON "Secret"("xrpl_address");
