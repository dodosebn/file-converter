import { CircleQuestionMark, FileText, LayoutGrid, LogOut, Moon, Settings, Share2, Users } from "lucide-react";



export const SideItems = [
  {
    icon: LayoutGrid,
    name: 'Home'
  },
    {
    icon: FileText,
    name: 'All Files'
  },
   {
    icon: Share2,
    name: 'Shared by You'
  },
   {
    icon: Users,
    name: 'Shared with You'
  },
   {
    icon: Settings ,
    name: 'Settings'
  },
    {
    icon: CircleQuestionMark,
    name: 'Support Center'
  },
  {
    icon: CircleQuestionMark,
    name: 'Support Center'
  },
  {
    icon: LogOut,
    name: 'LogOut'
  },
  {
    icon: Moon,
    name: 'Dark mode'
  }
];

export const convertibles = [
  {
    convert: 'DOCX',
    quote: 'PDF'
  },
    {
    base: 'XLSX',
    quote: 'PDF'
  },
     {
    base: 'JPG',
    quote: 'PDF'
  },
    {
    base: 'PDF',
    quote: 'JPG'
  }
]