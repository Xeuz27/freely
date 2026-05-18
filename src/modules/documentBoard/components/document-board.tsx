'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { WorkspaceHeader } from '@/modules/core/components/workspace-Header'
import { Bold, FileText, Italic, List, ListOrdered, Type, Underline } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'

type DocTemplate = {
	id: string
	title: string
	description: string
	content: string
}

const initialTemplates: DocTemplate[] = [
	{
		id: 'proposal',
		title: 'Project Proposal',
		description: 'Scope, timeline, deliverables, pricing',
		content:
			'<h2>Project Proposal</h2><p><strong>Client:</strong> [Client Name]</p><p><strong>Objective:</strong> [What the client needs]</p><p><strong>Timeline:</strong> [Start date] - [End date]</p><ul><li>Deliverable 1</li><li>Deliverable 2</li><li>Deliverable 3</li></ul><p><strong>Investment:</strong> $[Amount]</p>'
	},
	{
		id: 'contract',
		title: 'Freelance Contract',
		description: 'Terms, payment milestones, responsibilities',
		content:
			'<h2>Freelance Contract</h2><p>This agreement is between <strong>[Your Name]</strong> and <strong>[Client Name]</strong>.</p><p><strong>Scope of work:</strong></p><ul><li>Task 1</li><li>Task 2</li></ul><p><strong>Payment terms:</strong> [Net 15 / Net 30]</p><p><strong>Revision policy:</strong> [Number of revisions]</p><p><strong>Termination clause:</strong> [Terms]</p>'
	},
	{
		id: 'invoice',
		title: 'Invoice Draft',
		description: 'Services list, rates, totals, due date',
		content:
			'<h2>Invoice</h2><p><strong>Invoice #:</strong> INV-001</p><p><strong>Issue date:</strong> [Date]</p><p><strong>Due date:</strong> [Date]</p><ul><li>Service A - $[Amount]</li><li>Service B - $[Amount]</li></ul><p><strong>Total:</strong> $[Total]</p>'
	},
	{
		id: 'brief',
		title: 'Client Brief',
		description: 'Requirements, goals, constraints',
		content:
			'<h2>Client Brief</h2><p><strong>Project:</strong> [Project Name]</p><p><strong>Goals:</strong></p><ul><li>Goal 1</li><li>Goal 2</li></ul><p><strong>Audience:</strong> [Target audience]</p><p><strong>Constraints:</strong> [Budget, timeline, tools]</p>'
	}
]

export function DocumentBoard() {
	const editorRef = useRef<HTMLDivElement | null>(null)
	const [documents, setDocuments] = useState<DocTemplate[]>(initialTemplates)
	const [selectedId, setSelectedId] = useState(initialTemplates[0].id)

	const selectedDocument = useMemo(() => documents.find((item) => item.id === selectedId) ?? documents[0], [documents, selectedId])

	const applyFormat = (command: string, value?: string) => {
		editorRef.current?.focus()
		document.execCommand(command, false, value)
	}

	const handleEditorInput = () => {
		if (!editorRef.current) return
		const nextContent = editorRef.current.innerHTML
		setDocuments((prev) => prev.map((item) => (item.id === selectedId ? { ...item, content: nextContent } : item)))
	}

	return (
		<section className="h-full flex flex-col flex-1 px-4">
			<WorkspaceHeader>
				<WorkspaceHeader.Content
					title='Documents Board'
					description='Add, create, edit your document templates'
					Icon={FileText}
				/>
				{/* <WorkspaceHeader.Actions>
					<WorkspaceHeader.Button
						text='Add Template'
						onClick={()=> console.log('asd')}
					/>
				</WorkspaceHeader.Actions> */}
			</WorkspaceHeader>
			<div className="flex h-full flex-1 min-h-0 ">
				<aside className="border-b w-[280px] p-3 md:border-r md:border-b-0">
					<div className="mb-3 flex items-center gap-2">
						<FileText className="size-4 text-muted-foreground" />
						<h2 className="text-sm font-semibold tracking-wide">Documents Board</h2>
					</div>
					<div className="space-y-2">
						{documents.map((item) => (
							<button
								type="button"
								key={item.id}
								onClick={() => setSelectedId(item.id)}
								className={cn(
									'w-full rounded-md border p-3 text-left transition-colors',
									selectedId === item.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/60'
								)}
							>
								<p className="text-sm font-medium">{item.title}</p>
								<p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
							</button>
						))}
					</div>
				</aside>

				<div className="flex flex-1 flex-col">
					<div className="flex flex-wrap items-center gap-2 border-b p-2">
						<Button variant="outline" size="sm" onClick={() => applyFormat('bold')}>
							<Bold />
						</Button>
						<Button variant="outline" size="sm" onClick={() => applyFormat('italic')}>
							<Italic />
						</Button>
						<Button variant="outline" size="sm" onClick={() => applyFormat('underline')}>
							<Underline />
						</Button>
						<Button variant="outline" size="sm" onClick={() => applyFormat('formatBlock', '<h2>')}>
							<Type />
							H2
						</Button>
						<Button variant="outline" size="sm" onClick={() => applyFormat('insertUnorderedList')}>
							<List />
						</Button>
						<Button variant="outline" size="sm" onClick={() => applyFormat('insertOrderedList')}>
							<ListOrdered />
						</Button>
					</div>

					<div className="min-h-0 flex-1 p-3">
						<div
							ref={editorRef}
							contentEditable
							suppressContentEditableWarning
							onInput={handleEditorInput}
							dangerouslySetInnerHTML={{ __html: selectedDocument.content }}
							className="h-full min-h-[360px] overflow-auto rounded-md border bg-card p-4 text-sm leading-6 outline-none focus-visible:ring-2 focus-visible:ring-ring"
						/>
					</div>
				</div>
			</div>
		</section>
	)
}
