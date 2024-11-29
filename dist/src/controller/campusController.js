"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBranch = exports.createBranch = exports.updateCampus = exports.createCampus = exports.getCampusByname = exports.getCampusById = exports.getAllCampus = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllCampus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campus = yield prisma.campus.findMany();
        return res.status(200).json({ message: "Campus fetched successfully!", success: true, data: campus });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong! Please try after some time.", success: false });
    }
});
exports.getAllCampus = getAllCampus;
const getCampusById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const campus = yield prisma.campus.findUnique({
            where: { id: Number(id) }
        });
        return res.status(200).json({ message: "Campus fetched successfully!", success: true, data: campus });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong! Please try after some time.", success: false });
    }
});
exports.getCampusById = getCampusById;
const getCampusByname = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        const campus = yield prisma.campus.findFirst({
            where: { name }
        });
        return res.status(200).json({ message: "Campus fetched successfully!", success: true, data: campus });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong! Please try after some time.", success: false });
    }
});
exports.getCampusByname = getCampusByname;
const createCampus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, logo, location, role, foundedYear } = req.body;
    let newCampus;
    try {
        yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            newCampus = yield tx.campus.create({
                data: {
                    name,
                    logo,
                    location,
                    foundedYear
                },
            });
        }));
        return res.status(201).json({
            data: newCampus,
            message: "Campus created successfully",
            success: true,
        });
    }
    catch (error) {
        console.error("Error creating campus:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
});
exports.createCampus = createCampus;
const updateCampus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, logo, location, foundedYear } = req.body;
    try {
        const campus = yield prisma.campus.update({
            where: { id },
            data: { name, logo, location, foundedYear }
        });
        return res.status(200).json({ message: "Campus updated successfully!", success: true, data: campus });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong! Please try after some time.", success: false });
    }
});
exports.updateCampus = updateCampus;
const createBranch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { BranchName, location, campusId, subscriptionExpiryDate } = req.body;
    try {
        const branch2 = yield prisma.branch.findFirst({
            where: {
                name: BranchName,
                location: location,
                campusId: campusId
            }
        });
        if (branch2) {
            return res.status(400).json({
                message: "Branch already exist",
                success: false,
            });
        }
        const campus = yield prisma.campus.findFirst({
            where: {
                id: campusId
            }
        });
        if (!campus) {
            return res.status(400).json({
                message: "Campus not found",
                success: false,
            });
        }
        const branch = yield prisma.branch.create({
            data: {
                name: BranchName,
                campusId: campus.id,
                location: location
            }
        });
        //   prisma.$transaction(async (tx) => {
        //   await Promise.all( 
        //     BranchName.map(async (branch:string)=>{
        //       newBranch = await tx.branch.create({
        //         data: {
        //           name:branch,
        //           campusId,
        //         },
        //       });
        //     const branchid=await tx.branch.findFirst({
        //       where:{
        //         name:adminbranch,
        //         campusId:campusId
        //       }
        //     })
        //     if(branchid){
        //     await tx.admin.update({
        //       where: {
        //         id: adminId,
        //       },
        //       data: {
        //         branchId: branchid.id,
        //         },
        //       });
        //     }
        //   })
        // )
        //   })
        return res.status(201).json({
            data: branch,
            message: "Branch created successfully",
            success: true,
        });
    }
    catch (error) {
        console.error("Error creating branch:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
});
exports.createBranch = createBranch;
const deleteBranch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { branchName, campusId } = req.body;
    try {
        let branchExist;
        yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // branchExist= await branchName.map(async (branch:string)=>{
            //   branchExist=await tx.branch.findFirst({
            //     where:{
            //       name:branch,
            //       campusId:campusId
            //     }
            //   })
            // })
            console.log(branchName);
            yield Promise.all(branchName.map((branch) => __awaiter(void 0, void 0, void 0, function* () {
                const branchRecord = yield tx.branch.findFirst({
                    where: {
                        name: branch,
                        campusId: campusId
                    },
                    select: {
                        id: true
                    }
                });
                if (branchRecord) {
                    yield tx.branch.delete({
                        where: {
                            id: branchRecord.id
                        },
                    });
                }
            })));
        }));
        return res.status(200).json({
            message: "Branch deleted successfully",
            success: true,
        });
    }
    catch (error) {
        console.error("Error deleting branch:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
});
exports.deleteBranch = deleteBranch;
// export const campusupdate = async (req: Request, res: Response) => {
//   const { id, name, logo, location, foundedYear } = req.body;
//   try {
// const campus = await prisma.campus.findFirst({
//   where:{
//     id:id
//   }
// })
// if(!campus){
//   return res.status(400).json({
//     message: "Campus not found",
//     success: false,
//   });
// }
//     const campus = await prisma.campus.update({
//       where: { id },
//       data: { name, logo, location, foundedYear }
//     });
//   }catch(error){
//     console.error("Error updating campus:", error);
//     return res
//       .status(500)
//       .json({ message: "Internal server error", success: false });
//   }
// }
