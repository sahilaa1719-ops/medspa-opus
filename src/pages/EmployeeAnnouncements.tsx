import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Bell } from 'lucide-react';

const EmployeeAnnouncements = () => {
  // Sample announcements
  const announcements = [
    {
      id: '1',
      title: 'Holiday Schedule 2024',
      date: new Date('2024-12-01'),
      content: 'Office will be closed December 24-26 for the holidays. Emergency contact information has been sent via email.',
      priority: 'Important' as const,
    },
    {
      id: '2',
      title: 'New Safety Protocols',
      date: new Date('2024-11-15'),
      content: 'Please review the updated safety protocols document attached. All staff must complete the safety quiz by end of month.',
      priority: 'Normal' as const,
    },
    {
      id: '3',
      title: 'Staff Meeting - Friday',
      date: new Date('2024-11-10'),
      content: 'Monthly staff meeting Friday at 3 PM in the main conference room. Attendance is mandatory.',
      priority: 'Normal' as const,
    },
  ];

  const getPriorityBadge = (priority: 'Important' | 'Normal') => {
    const variants = {
      Important: 'bg-red-100 text-red-800 hover:bg-red-100',
      Normal: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
    };

    return (
      <Badge className={variants[priority]}>
        {priority}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-50">
          <Bell className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-sm text-gray-500">
            Stay updated with company news and important notices
          </p>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="border border-[#E5E7EB] bg-white shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {announcement.title}
                </CardTitle>
                {getPriorityBadge(announcement.priority)}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {announcement.date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {announcement.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Announcement Count */}
      <div className="text-sm text-gray-500">
        Showing {announcements.length} announcement{announcements.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default EmployeeAnnouncements;
