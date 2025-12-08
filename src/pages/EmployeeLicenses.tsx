import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Calendar, Hash, AlertCircle } from 'lucide-react';

const EmployeeLicenses = () => {
  // Sample licenses for Sarah Johnson
  const licenses = [
    {
      id: '1',
      type: 'RN License',
      number: 'RN-12345',
      issueDate: new Date('2023-01-01'),
      expiryDate: new Date('2025-12-31'),
      status: 'Valid' as const,
      daysRemaining: 365,
    },
    {
      id: '2',
      type: 'CPR Certification',
      number: 'CPR-78901',
      issueDate: new Date('2024-06-01'),
      expiryDate: new Date('2025-06-01'),
      status: 'Expiring Soon' as const,
      daysRemaining: 174,
    },
  ];

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
                      {license.type}
                    </CardTitle>
                    <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                      <Hash className="h-3.5 w-3.5" />
                      <span>{license.number}</span>
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
                    {license.issueDate.toLocaleDateString('en-US', {
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
                    {license.expiryDate.toLocaleDateString('en-US', {
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
                  Expires in {license.daysRemaining} days
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
    </div>
  );
};

export default EmployeeLicenses;
