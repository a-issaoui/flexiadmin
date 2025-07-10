'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@/components/common/icon';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Mock search results - in a real app, this would come from an API
const mockSearchResults = [
  { id: '1', title: 'Dashboard', href: '/admin', category: 'Pages' },
  { id: '2', title: 'Users', href: '/admin/users', category: 'Pages' },
  { id: '3', title: 'Roles', href: '/admin/roles', category: 'Pages' },
  { id: '4', title: 'Permissions', href: '/admin/permissions', category: 'Pages' },
  { id: '5', title: 'Settings', href: '/admin/settings', category: 'Pages' },
];

export default function NavbarSearch() {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState(mockSearchResults);

    // Filter results based on search term
    useEffect(() => {
        if (!searchTerm) {
            setResults(mockSearchResults);
        } else {
            const filtered = mockSearchResults.filter(item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setResults(filtered);
        }
    }, [searchTerm]);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen(prev => !prev);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSelect = (href: string) => {
        try {
            setOpen(false);
            setSearchTerm('');
            // In a real app, use router.push(href)
            window.location.href = href;
        } catch (error) {
            console.error('Error navigating to:', href, error);
            // In a real app, show a toast notification
        }
    };

    return (
        <div className='w-full space-y-2'>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant='outline'
                        role="combobox"
                        aria-expanded={open}
                        className='bg-background text-muted-foreground relative h-9 w-full justify-start rounded-[0.5rem] text-sm font-normal shadow-none sm:pe-12 md:w-42  lg:w-64'
                    >
                        <Icon name="MagnifyingGlassIcon" size={16} weight="duotone" className='me-2 h-4 w-4' />
                        Search...
                        <kbd className='bg-muted pointer-events-none absolute top-[0.3rem] end-[0.3rem] hidden h-6 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex'>
                            <span className='text-xs'>⌘</span>K
                        </kbd>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                    <Command>
                        <CommandInput
                            placeholder="Search pages and features..."
                            value={searchTerm}
                            onValueChange={setSearchTerm}
                        />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            {results.length > 0 && (
                                <CommandGroup heading="Results">
                                    {results.map((item) => (
                                        <CommandItem
                                            key={item.id}
                                            value={item.title}
                                            onSelect={() => handleSelect(item.href)}
                                            className="cursor-pointer"
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-medium">{item.title}</span>
                                                <span className="text-xs text-muted-foreground">{item.category}</span>
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}