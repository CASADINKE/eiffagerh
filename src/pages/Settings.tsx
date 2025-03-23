
import { useState } from "react";
import { Shield, Users, Building, Bell, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock roles and permissions data
const roles = [
  {
    id: "1",
    name: "Administrator",
    description: "Full access to all settings and features",
    usersCount: 2,
    permissions: ["all"],
  },
  {
    id: "2",
    name: "HR Manager",
    description: "Can manage employees, leaves and payroll",
    usersCount: 5,
    permissions: ["employees", "leaves", "salary"],
  },
  {
    id: "3",
    name: "Employee",
    description: "Basic access to personal information and time tracking",
    usersCount: 120,
    permissions: ["profile", "time", "leave-request"],
  },
  {
    id: "4",
    name: "Team Lead",
    description: "Can manage team members and approve team leaves",
    usersCount: 10,
    permissions: ["team-view", "leave-approve", "time-approve"],
  },
] as const;

const Settings = () => {
  const [activeTab, setActiveTab] = useState("roles");
  
  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">Manage your HR system configuration</p>
      </div>
      
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full p-0">
            <TabsTrigger value="roles" className="gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Shield size={16} />
              <span>Roles & Permissions</span>
            </TabsTrigger>
            <TabsTrigger value="company" className="gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Building size={16} />
              <span>Company</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Bell size={16} />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Mail size={16} />
              <span>Integrations</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="roles" className="p-6">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-semibold">Roles & Permissions</h2>
              <Button>Add New Role</Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>{role.usersCount}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                      {role.name !== "Administrator" && (
                        <Button variant="outline" size="sm">Delete</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Permission Groups</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-4">
                  <h4 className="text-md font-medium mb-3">Employee Management</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-view-employees" />
                      <label htmlFor="perm-view-employees" className="text-sm">View Employees</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-add-employees" />
                      <label htmlFor="perm-add-employees" className="text-sm">Add Employees</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-edit-employees" />
                      <label htmlFor="perm-edit-employees" className="text-sm">Edit Employees</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-delete-employees" />
                      <label htmlFor="perm-delete-employees" className="text-sm">Delete Employees</label>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h4 className="text-md font-medium mb-3">Leave Management</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-view-leaves" />
                      <label htmlFor="perm-view-leaves" className="text-sm">View Leaves</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-approve-leaves" />
                      <label htmlFor="perm-approve-leaves" className="text-sm">Approve Leaves</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-add-leaves" />
                      <label htmlFor="perm-add-leaves" className="text-sm">Add Leave Types</label>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h4 className="text-md font-medium mb-3">Payroll & Salary</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-view-salary" />
                      <label htmlFor="perm-view-salary" className="text-sm">View Salaries</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-edit-salary" />
                      <label htmlFor="perm-edit-salary" className="text-sm">Edit Salaries</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-run-payroll" />
                      <label htmlFor="perm-run-payroll" className="text-sm">Run Payroll</label>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h4 className="text-md font-medium mb-3">Time Tracking</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-view-time" />
                      <label htmlFor="perm-view-time" className="text-sm">View Time Records</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-edit-time" />
                      <label htmlFor="perm-edit-time" className="text-sm">Edit Time Records</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-approve-time" />
                      <label htmlFor="perm-approve-time" className="text-sm">Approve Timesheets</label>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h4 className="text-md font-medium mb-3">Reports</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-view-reports" />
                      <label htmlFor="perm-view-reports" className="text-sm">View Reports</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-export-reports" />
                      <label htmlFor="perm-export-reports" className="text-sm">Export Reports</label>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h4 className="text-md font-medium mb-3">System Settings</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-view-settings" />
                      <label htmlFor="perm-view-settings" className="text-sm">View Settings</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-edit-settings" />
                      <label htmlFor="perm-edit-settings" className="text-sm">Edit Settings</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-manage-roles" />
                      <label htmlFor="perm-manage-roles" className="text-sm">Manage Roles</label>
                    </div>
                  </div>
                </Card>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="company" className="p-6">
            <h2 className="text-xl font-semibold mb-6">Company Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" defaultValue="HR Zenith Inc." />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-email">Company Email</Label>
                  <Input id="company-email" type="email" defaultValue="admin@hrzenith.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-phone">Company Phone</Label>
                  <Input id="company-phone" type="tel" defaultValue="+1 234 567 890" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-website">Company Website</Label>
                  <Input id="company-website" type="url" defaultValue="https://hrzenith.com" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-address">Company Address</Label>
                  <Input id="company-address" defaultValue="123 Business Ave." />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-city">City</Label>
                  <Input id="company-city" defaultValue="San Francisco" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-state">State</Label>
                    <Input id="company-state" defaultValue="California" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company-zip">Zip Code</Label>
                    <Input id="company-zip" defaultValue="94105" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-country">Country</Label>
                  <Select defaultValue="usa">
                    <SelectTrigger id="company-country">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usa">United States</SelectItem>
                      <SelectItem value="canada">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="australia">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Working Hours & Holidays</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h4 className="text-md font-medium mb-3">Working Hours</h4>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Monday to Friday</span>
                      <div className="flex gap-2">
                        <Select defaultValue="9">
                          <SelectTrigger className="w-[80px]">
                            <SelectValue placeholder="Start" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem key={i} value={`${i + 8}`}>{i + 8}:00</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="self-center">to</span>
                        <Select defaultValue="17">
                          <SelectTrigger className="w-[80px]">
                            <SelectValue placeholder="End" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem key={i} value={`${i + 13}`}>{i + 13}:00</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Saturday</span>
                      <div className="flex gap-2">
                        <Select defaultValue="closed">
                          <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Sunday</span>
                      <div className="flex gap-2">
                        <Select defaultValue="closed">
                          <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-md font-medium">Holidays</h4>
                    <Button variant="outline" size="sm" className="h-8">Add Holiday</Button>
                  </div>
                  
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                    {[
                      { name: "New Year's Day", date: "2023-01-01" },
                      { name: "Martin Luther King Jr. Day", date: "2023-01-16" },
                      { name: "Memorial Day", date: "2023-05-29" },
                      { name: "Independence Day", date: "2023-07-04" },
                      { name: "Labor Day", date: "2023-09-04" },
                      { name: "Thanksgiving Day", date: "2023-11-23" },
                      { name: "Christmas Day", date: "2023-12-25" },
                    ].map((holiday, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                        <span>{holiday.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {new Date(holiday.date).toLocaleDateString()}
                          </span>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <span className="sr-only">Delete</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <path d="M18 6 6 18" />
                              <path d="m6 6 12 12" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button>Save Company Settings</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="p-6">
            <h2 className="text-xl font-semibold mb-6">Notification Settings</h2>
            
            <div className="space-y-6">
              <Card className="p-4">
                <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium">New Employee Registered</h4>
                      <p className="text-xs text-muted-foreground">Notify when a new employee is added to the system</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium">Leave Request</h4>
                      <p className="text-xs text-muted-foreground">Notify when an employee submits a leave request</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium">Leave Approval</h4>
                      <p className="text-xs text-muted-foreground">Notify employees when their leave is approved or rejected</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium">Salary Updates</h4>
                      <p className="text-xs text-muted-foreground">Notify employees when their salary is updated</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium">Payroll Processing</h4>
                      <p className="text-xs text-muted-foreground">Notify employees when payroll is processed</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <h3 className="text-lg font-medium mb-4">System Notifications</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium">System Updates</h4>
                      <p className="text-xs text-muted-foreground">Notify administrators about system updates</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium">Security Alerts</h4>
                      <p className="text-xs text-muted-foreground">Send alerts for suspicious login attempts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium">Data Backup Notifications</h4>
                      <p className="text-xs text-muted-foreground">Notify when data backups are completed</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <h3 className="text-lg font-medium mb-4">Reminder Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium">Probation Period Ending</h4>
                      <p className="text-xs text-muted-foreground">Send reminders before employee probation periods end</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Select defaultValue="7">
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="Days before" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 days</SelectItem>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="14">14 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                        </SelectContent>
                      </Select>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium">Contract Renewal</h4>
                      <p className="text-xs text-muted-foreground">Send reminders before employee contracts expire</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Select defaultValue="30">
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="Days before" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="14">14 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                        </SelectContent>
                      </Select>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium">Employee Birthdays</h4>
                      <p className="text-xs text-muted-foreground">Send birthday reminders</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Select defaultValue="1">
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="Days before" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Same day</SelectItem>
                          <SelectItem value="1">1 day</SelectItem>
                          <SelectItem value="3">3 days</SelectItem>
                          <SelectItem value="7">7 days</SelectItem>
                        </SelectContent>
                      </Select>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button>Save Notification Settings</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="integrations" className="p-6">
            <h2 className="text-xl font-semibold mb-6">Integrations</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium">Email Integration</h3>
                    <p className="text-sm text-muted-foreground">Connect your email service provider</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-server">SMTP Server</Label>
                    <Input id="smtp-server" defaultValue="smtp.example.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">SMTP Port</Label>
                    <Input id="smtp-port" defaultValue="587" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtp-username">Username</Label>
                    <Input id="smtp-username" defaultValue="notifications@hrzenith.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtp-password">Password</Label>
                    <Input id="smtp-password" type="password" defaultValue="••••••••••••" />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button variant="outline" size="sm">Test Connection</Button>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium">Calendar Integration</h3>
                    <p className="text-sm text-muted-foreground">Connect with Google Calendar or Outlook</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="calendar-provider">Calendar Provider</Label>
                    <Select>
                      <SelectTrigger id="calendar-provider">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="google">Google Calendar</SelectItem>
                        <SelectItem value="outlook">Microsoft Outlook</SelectItem>
                        <SelectItem value="apple">Apple Calendar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="calendar-sync">Sync Events</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="sync-holidays" />
                        <label htmlFor="sync-holidays" className="text-sm">Company Holidays</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="sync-leave" />
                        <label htmlFor="sync-leave" className="text-sm">Employee Leave</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="sync-meetings" />
                        <label htmlFor="sync-meetings" className="text-sm">Team Meetings</label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button>Connect Calendar</Button>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium">Slack Integration</h3>
                    <p className="text-sm text-muted-foreground">Connect with your Slack workspace</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="slack-webhook">Slack Webhook URL</Label>
                    <Input id="slack-webhook" placeholder="https://hooks.slack.com/services/..." />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Notification Events</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="slack-leave" />
                        <label htmlFor="slack-leave" className="text-sm">Leave Requests</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="slack-new-employee" />
                        <label htmlFor="slack-new-employee" className="text-sm">New Employees</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="slack-birthdays" />
                        <label htmlFor="slack-birthdays" className="text-sm">Birthday Reminders</label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button>Connect Slack</Button>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium">API Access</h3>
                    <p className="text-sm text-muted-foreground">Manage API tokens for external integrations</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <div className="flex gap-2">
                      <Input id="api-key" defaultValue="••••••••••••••••••••••••••••••" readOnly />
                      <Button variant="outline" size="sm">Generate</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>API Access Permissions</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="api-read" />
                        <label htmlFor="api-read" className="text-sm">Read Data</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="api-write" />
                        <label htmlFor="api-write" className="text-sm">Write Data</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="api-delete" />
                        <label htmlFor="api-delete" className="text-sm">Delete Data</label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button variant="outline" size="sm">View API Documentation</Button>
                </div>
              </Card>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button>Save Integration Settings</Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Settings;
