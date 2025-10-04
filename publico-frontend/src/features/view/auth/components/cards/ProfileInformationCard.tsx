import useConnectWallet from "features/controller/agency/hooks/useConnectWallet";
import { Button } from "features/view/citizen/ui/button";
import { CardContent } from "features/view/citizen/ui/card";
import { Label } from "features/view/citizen/ui/label";
import { Card, Input } from "@shared/ui";
import { User } from "lucide-react";


export default function ProfileInformationCard(){
    const {isEditing, walletData, profile,handleSave, setIsEditing, setProfile} = useConnectWallet();
    return (
        <Card>
            <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="mb-1 text-xl font-semibold text-foreground">Ageny User</h2>
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
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profile.name}
                    onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={profile.address}
                    onChange={(e) => setProfile((prev) => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave}>Save Changes</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Full Name</span> 
                  <p className="font-medium">{profile.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email</span>
                  <p className="font-medium">{profile.email}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Address</span>
                  <p className="font-medium">{profile.address}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Phone Number</span>
                  <p className="font-medium">{profile.phone}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

    )
}