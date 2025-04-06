
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useHealthData } from "@/context/HealthDataContext";
import { Company } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CompanyForm } from "@/components/admin/CompanyForm";
import { Plus, FileEdit, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminCompaniesPage() {
  const { companies, deleteCompany } = useHealthData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const handleDeleteCompany = () => {
    if (currentCompany) {
      deleteCompany(currentCompany.id);
      toast({
        title: "Company deleted",
        description: `${currentCompany.name} has been deleted successfully.`,
      });
      setIsDeleteDialogOpen(false);
      setCurrentCompany(null);
    }
  };

  const openEditDialog = (company: Company) => {
    setCurrentCompany(company);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (company: Company) => {
    setCurrentCompany(company);
    setIsDeleteDialogOpen(true);
  };

  const filteredCompanies = companies.filter(
    company => company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Companies</h1>
            <p className="text-muted-foreground">Manage healthcare providers</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Company
          </Button>
        </div>

        <div className="flex items-center mb-6">
          <div className="relative flex-grow max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Payment Methods</TableHead>
                <TableHead>Countries</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "No companies match your search" : "No companies found. Add a new company to get started."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCompanies.map(company => {
                  // Get country names based on country IDs
                  const countryNames = company.countries?.map(
                    countryId => COUNTRIES.find(c => c.id === countryId)?.name || countryId
                  ).join(", ") || "N/A";

                  return (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">{company.name}</TableCell>
                      <TableCell>{company.paymentMethods || "N/A"}</TableCell>
                      <TableCell>
                        <span className="line-clamp-1">{countryNames}</span>
                      </TableCell>
                      <TableCell>
                        {company.active ? (
                          <Badge variant="outline" className="health-badge-success">Active</Badge>
                        ) : (
                          <Badge variant="outline" className="health-badge-muted">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(company)}>
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(company)}
                            className="text-destructive hover:text-destructive/90"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Company Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Company</DialogTitle>
            <DialogDescription>
              Create a new healthcare provider with the details below.
            </DialogDescription>
          </DialogHeader>
          <CompanyForm mode="add" onCancel={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Company Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>
              Update the company details.
            </DialogDescription>
          </DialogHeader>
          {currentCompany && (
            <CompanyForm
              mode="edit"
              company={currentCompany}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Company Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Company</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this company? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCompany}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}

// Countries array for company locations
const COUNTRIES = [
  { id: "us", name: "United States" },
  { id: "ca", name: "Canada" },
  { id: "uk", name: "United Kingdom" },
  { id: "au", name: "Australia" },
  { id: "de", name: "Germany" },
  { id: "fr", name: "France" },
  { id: "jp", name: "Japan" },
  { id: "cn", name: "China" },
  { id: "in", name: "India" },
  { id: "br", name: "Brazil" },
];
