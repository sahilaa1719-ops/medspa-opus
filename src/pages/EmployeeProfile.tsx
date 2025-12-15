import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Phone, Calendar, MapPin, User, AlertCircle, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

const EmployeeProfile = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [employee, setEmployee] = useState<any>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  
  // Editable fields state
  const [editedData, setEditedData] = useState({
    photoUrl: '',
    phone: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
  });

  // Fetch employee data on mount
  useEffect(() => {
    fetchEmployeeData();
  }, [user?.email]);

  const fetchEmployeeData = async () => {
    if (!user?.email) return;

    try {
      setIsLoading(true);

      // Fetch employee data by email
      const { data: employeeData, error: employeeError } = await supabase
        .from('employees')
        .select('*')
        .eq('email', user.email)
        .single();

      if (employeeError) {
        console.error('Error fetching employee:', employeeError);
        toast({
          title: 'Error',
          description: 'Failed to load profile data',
          variant: 'destructive',
        });
        return;
      }

      setEmployee(employeeData);
      
      // Initialize editable data
      setEditedData({
        photoUrl: employeeData?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(employeeData?.full_name || '')}&background=F3F4F6&color=374151`,
        phone: employeeData?.phone || '',
        emergencyContactName: employeeData?.emergency_contact_name || '',
        emergencyContactPhone: employeeData?.emergency_contact_phone || '',
        emergencyContactRelationship: employeeData?.emergency_contact_relationship || '',
      });

      // Fetch all locations (for simplicity, showing all locations as assigned)
      // In a real implementation, you'd have an employee_locations junction table
      const { data: locationsData, error: locationsError } = await supabase
        .from('locations')
        .select('*');

      if (!locationsError && locationsData) {
        setLocations(locationsData);
      }

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    if (!employee) return;
    setIsEditing(true);
    // Reset edited data to current values
    setEditedData({
      photoUrl: employee.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.full_name || '')}&background=F3F4F6&color=374151`,
      phone: employee.phone || '',
      emergencyContactName: employee.emergency_contact_name || '',
      emergencyContactPhone: employee.emergency_contact_phone || '',
      emergencyContactRelationship: employee.emergency_contact_relationship || '',
    });
  };

  const handleCancel = () => {
    if (!employee) return;
    setIsEditing(false);
    // Reset to original values
    setEditedData({
      photoUrl: employee.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.full_name || '')}&background=F3F4F6&color=374151`,
      phone: employee.phone || '',
      emergencyContactName: employee.emergency_contact_name || '',
      emergencyContactPhone: employee.emergency_contact_phone || '',
      emergencyContactRelationship: employee.emergency_contact_relationship || '',
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload an image file',
          variant: 'destructive',
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please upload an image smaller than 5MB',
          variant: 'destructive',
        });
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData(prev => ({
          ...prev,
          photoUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    if (!employee) return;

    try {
      // Update employee data in Supabase
      const { error } = await supabase
        .from('employees')
        .update({
          phone: editedData.phone,
          emergency_contact_name: editedData.emergencyContactName,
          emergency_contact_phone: editedData.emergencyContactPhone,
          emergency_contact_relationship: editedData.emergencyContactRelationship,
          photo_url: editedData.photoUrl,
        })
        .eq('email', user?.email);

      if (error) {
        console.error('Error updating employee:', error);
        toast({
          title: 'Error',
          description: 'Failed to update profile',
          variant: 'destructive',
        });
        return;
      }

      // Update local state
      setEmployee({
        ...employee,
        phone: editedData.phone,
        emergency_contact_name: editedData.emergencyContactName,
        emergency_contact_phone: editedData.emergencyContactPhone,
        emergency_contact_relationship: editedData.emergencyContactRelationship,
        photo_url: editedData.photoUrl,
      });

      setIsEditing(false);

      toast({
        title: 'Profile updated!',
        description: 'Your changes have been saved successfully.',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading profile...</div>
        </div>
      ) : !employee ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">No profile data found</div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button 
                    onClick={handleCancel}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveChanges}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={handleEditClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={hasPendingChanges}
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

      {/* Pending Changes Banner */}
      {hasPendingChanges && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Profile changes pending admin approval
          </AlertDescription>
        </Alert>
      )}

      {/* Profile Section */}
      <Card className="border border-[#E5E7EB] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            {/* Profile Photo */}
            <div className="relative">
              <Avatar className="h-24 w-24 border-2 border-gray-200">
                <AvatarImage 
                  src={isEditing ? editedData.photoUrl : (employee.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.full_name || '')}&background=F3F4F6&color=374151`)} 
                  alt={employee.full_name} 
                />
                <AvatarFallback className="bg-gray-100 text-gray-700 text-2xl">
                  {employee.full_name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white h-7 px-2 text-xs"
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    Change
                  </Button>
                </>
              )}
            </div>

            {/* Profile Details */}
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{employee.full_name}</h2>
                <p className="text-lg text-gray-600">{employee.position}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-500">{employee.email}</span>
                </div>
                
                <div>
                  {isEditing ? (
                    <div className="space-y-1">
                      <Label htmlFor="phone" className="text-sm text-gray-700">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={editedData.phone}
                        onChange={(e) => setEditedData(prev => ({ ...prev, phone: e.target.value }))}
                        className="h-9"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{employee.phone || 'Not provided'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employment Details */}
      <Card className="border border-[#E5E7EB] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Employment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-50">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Hire Date</p>
                <p className="text-base font-medium text-gray-900">
                  {new Date(employee.hire_date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-50">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge className={`mt-1 ${
                  employee.status === 'active' 
                    ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                }`}>
                  {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-50">
                <MapPin className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-2">Assigned Locations</p>
                <div className="flex flex-wrap gap-2">
                  {locations.length > 0 ? (
                    locations.map(location => (
                      <Badge 
                        key={location.id}
                        variant="outline"
                        className="bg-white border-gray-300 text-gray-700"
                      >
                        {location.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">No locations assigned</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card className="border border-[#E5E7EB] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="emergencyName" className="text-sm text-gray-700">
                  Name
                </Label>
                <Input
                  id="emergencyName"
                  type="text"
                  value={editedData.emergencyContactName}
                  onChange={(e) => setEditedData(prev => ({ 
                    ...prev, 
                    emergencyContactName: e.target.value 
                  }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="emergencyPhone" className="text-sm text-gray-700">
                  Phone
                </Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  value={editedData.emergencyContactPhone}
                  onChange={(e) => setEditedData(prev => ({ 
                    ...prev, 
                    emergencyContactPhone: e.target.value 
                  }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="emergencyRelationship" className="text-sm text-gray-700">
                  Relationship
                </Label>
                <Input
                  id="emergencyRelationship"
                  type="text"
                  value={editedData.emergencyContactRelationship}
                  onChange={(e) => setEditedData(prev => ({ 
                    ...prev, 
                    emergencyContactRelationship: e.target.value 
                  }))}
                  className="mt-1"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <span className="text-sm text-gray-500 mr-2">Name:</span>
                  <span className="text-base font-medium text-gray-900">
                    {employee.emergency_contact_name || 'Not provided'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <div>
                  <span className="text-sm text-gray-500 mr-2">Phone:</span>
                  <span className="text-base font-medium text-gray-900">
                    {employee.emergency_contact_phone || 'Not provided'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <span className="text-sm text-gray-500 mr-2">Relationship:</span>
                  <span className="text-base font-medium text-gray-900">
                    {employee.emergency_contact_relationship || 'Not provided'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
        </>
      )}
    </div>
  );
};

export default EmployeeProfile;
