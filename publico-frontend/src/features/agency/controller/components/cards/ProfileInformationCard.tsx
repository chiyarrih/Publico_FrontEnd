import { useState, useEffect } from "react";
import { useAgencyProfile } from "@agency/controller/hooks/useAgencyProfile";
import { Button } from "@shared/ui/button";
import { CardContent } from "@shared/ui/card";
import { Label } from "@shared/ui/label";
import { Card, Input } from "@shared/ui";
import { User } from "lucide-react";


export default function ProfileInformationCard(){
    const { user: agencyUser, isLoading, error, updateProfile } = useAgencyProfile();
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        department: "",
    });
    
    // Debug logging
    console.log('ProfileInformationCard - agencyUser:', agencyUser);
    console.log('ProfileInformationCard - isLoading:', isLoading);
    console.log('ProfileInformationCard - error:', error);

    // Update profile form when agencyUser data loads
    useEffect(() => {
        if (agencyUser) {
            setProfile({
                name: agencyUser.agency_name || "",
                email: agencyUser.contact_email || agencyUser.email || "",
                phone: agencyUser.contact_phone || "",
                address: agencyUser.address || "",
                department: agencyUser.department || "",
            });
        }
    }, [agencyUser]);

    const handleSave = async () => {
        try {
            await updateProfile({
                agency_name: profile.name,
                contact_phone: profile.phone,
                address: profile.address,
                department: profile.department,
            });
            setIsEditing(false);
            alert("Profile updated successfully! ✅");
        } catch (err) {
            console.error('Failed to update profile:', err);
            alert("Failed to update profile. Please try again.");
        }
    };
    return (
        <Card>
            <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="mb-1 text-xl font-semibold text-foreground">
                  {isLoading ? "Loading..." : agencyUser?.agency_name || "Agency User"}
                </h2>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)} className="mt-2">
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="agencyName">Agency Name</Label>
                  <Input
                    id="agencyName"
                    value={profile.name}
                    onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter agency name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="bg-gray-100"
                    placeholder="Email cannot be changed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed for security reasons</p>
                </div>
                <div>
                  <Label htmlFor="phone">Contact Phone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter contact phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={profile.address}
                    onChange={(e) => setProfile((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter agency address"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={profile.department}
                    onChange={(e) => setProfile((prev) => ({ ...prev, department: e.target.value }))}
                    placeholder="Enter department"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                    Error loading profile: {error}
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Agency Name</span> 
                  <p className="font-medium">{isLoading ? "Loading..." : agencyUser?.agency_name || "N/A"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email</span>
                  <p className="font-medium">{isLoading ? "Loading..." : agencyUser?.contact_email || "N/A"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Address</span>
                  <p className="font-medium">{isLoading ? "Loading..." : agencyUser?.address || "N/A"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Phone Number</span>
                  <p className="font-medium">{isLoading ? "Loading..." : agencyUser?.contact_phone || "N/A"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Agency Code</span>
                  <p className="font-medium">{isLoading ? "Loading..." : agencyUser?.agency_code || "N/A"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Department</span>
                  <p className="font-medium">{isLoading ? "Loading..." : agencyUser?.department || "N/A"}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

    )
}