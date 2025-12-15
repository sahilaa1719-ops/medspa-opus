import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Calendar, Hash, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

const EmployeeLicenses = () => {
  const { user } = useAuth();
  const [licenses, setLicenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLicenses();
  }, [user?.email]);

  const fetchLicenses = async () => {
    if (!user?.email) return;

    try {
      setIsLoading(true);

      // Fetch employee data by email
      const { data: employeeData, error: employeeError } = await supabase
        .from('employees')
        .select('id')
        .eq('email', user.email)
        .single();

      if (employeeError) {
        console.error('Error fetching employee:', employeeError);
        return;
      }

      if (employeeData) {
        // Fetch licenses for this employee
        const { data: licensesData, error: licensesError } = await supabase
          .from('licenses')
          .select('*')
          .eq('employee_id', employeeData.id)
          .order('expiry_date', { ascending: true });

        if (licensesError) {
          console.error('Error fetching licenses:', licensesError);
          return;
        }

        // Calculate status and days remaining for each license
        const today = new Date();
        const licensesWithStatus = (licensesData || []).map((license: any) => {
          const expiryDate = new Date(license.expiry_date);
          const daysRemaining = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          let status: 'Valid' | 'Expiring Soon' | 'Expired';
          if (daysRemaining < 0) {
            status = 'Expired';
          } else if (daysRemaining <= 30) {
            status = 'Expiring Soon';
          } else {
            status = 'Valid';
          }

          return {
            ...license,
            daysRemaining,
            status,
          };
        });

        setLicenses(licensesWithStatus);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: 'Valid' | 'Expiring Soon' | 'Expired') => {
    const variants = {
      Valid: 'bg-green-100 text-green-800 hover:bg-green-100',
      'Expiring Soon': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
      Expired: 'bg-red-100 text-red-800 hover:bg-red-100',
    };

    return (
      <Badge className={variants[status]}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Licenses</h1>
        <p className="text-sm text-gray-500 mt-1">
          View your certifications and licenses
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">
          Loading licenses...
        </div>
      ) : licenses.length === 0 ? (
        <Card className="border border-[#E5E7EB] bg-white shadow-sm">
          <CardContent className="py-12 text-center">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No licenses found</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* License Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {licenses.map((license) => (
              <Card key={license.id} className="border border-[#E5E7EB] bg-white shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-50">
                        <Award className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900">
                          {license.license_type}
                        </CardTitle>
                        <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                          <Hash className="h-3.5 w-3.5" />
                          <span>{license.license_number}</span>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(license.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Issue Date</span>
                      </div>
                      <p className="text-base font-medium text-gray-900 ml-5">
                        {new Date(license.issue_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Expiry Date</span>
                      </div>
                      <p className="text-base font-medium text-gray-900 ml-5">
                        {new Date(license.expiry_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Expiration Alert */}
                  <div 
                    className={`flex items-center gap-2 p-3 rounded-lg ${
                      license.status === 'Valid' 
                        ? 'bg-green-50 border border-green-200' 
                        : license.status === 'Expiring Soon'
                        ? 'bg-yellow-50 border border-yellow-200'
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <AlertCircle 
                      className={`h-4 w-4 ${
                        license.status === 'Valid' 
                          ? 'text-green-600' 
                          : license.status === 'Expiring Soon'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    />
                    <span 
                      className={`text-sm font-medium ${
                        license.status === 'Valid' 
                          ? 'text-green-800' 
                          : license.status === 'Expiring Soon'
                          ? 'text-yellow-800'
                          : 'text-red-800'
                      }`}
                    >
                      {license.daysRemaining < 0 
                        ? `Expired ${Math.abs(license.daysRemaining)} days ago`
                        : `Expires in ${license.daysRemaining} days`}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* License Count */}
          <div className="text-sm text-gray-500">
            Showing {licenses.length} license{licenses.length !== 1 ? 's' : ''}
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeeLicenses;
