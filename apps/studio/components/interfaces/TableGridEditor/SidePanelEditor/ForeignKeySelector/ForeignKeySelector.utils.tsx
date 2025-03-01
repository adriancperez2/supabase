import { FOREIGN_KEY_CASCADE_ACTION } from 'data/database/database-query-constants'
import type { ForeignKeyConstraint } from 'data/database/foreign-key-constraints-query'
import { HelpCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from 'ui'
import { getForeignKeyCascadeAction } from '../ColumnEditor/ColumnEditor.utils'
import type { ForeignKey } from './ForeignKeySelector.types'

export const formatForeignKeys = (fks: ForeignKeyConstraint[]): ForeignKey[] => {
  return fks.map((x) => {
    return {
      id: x.id,
      name: x.constraint_name,
      tableId: x.target_id,
      schema: x.target_schema,
      table: x.target_table,
      columns: x.source_columns.map((y, i) => ({ source: y, target: x.target_columns[i] })),
      deletionAction: x.deletion_action,
      updateAction: x.update_action,
    }
  })
}

export const generateCascadeActionDescription = (
  action: 'update' | 'delete',
  cascadeAction: string,
  reference: string
) => {
  const actionVerb = action === 'update' ? 'Updating' : 'Deleting'
  const actionName = getForeignKeyCascadeAction(cascadeAction) ?? 'No action'

  switch (cascadeAction) {
    case FOREIGN_KEY_CASCADE_ACTION.NO_ACTION:
      return (
        <>
          <span className="text-foreground-light">{actionName}</span>: {actionVerb} a record from{' '}
          <code className="text-xs text-foreground-light">{reference}</code> will{' '}
          <span className="text-amber-900 opacity-75">raise an error</span> if there are records
          existing in this table that reference it
        </>
      )
    case FOREIGN_KEY_CASCADE_ACTION.CASCADE:
      return (
        <>
          <span className="text-foreground-light">{actionName}</span>: {actionVerb} a record from{' '}
          <code className="text-xs text-foreground-light">{reference}</code> will{' '}
          <span className="text-amber-900 opacity-75">also {action}</span> any records that
          reference it in this table
        </>
      )
    case FOREIGN_KEY_CASCADE_ACTION.RESTRICT:
      return (
        <>
          <span className="text-foreground-light">{actionName}</span>
          <Tooltip>
            <TooltipTrigger className="translate-y-[3px] mx-1">
              <HelpCircle className="text-foreground-light" size={16} strokeWidth={1.5} />
            </TooltipTrigger>
            <TooltipContent side="bottom" className="w-80">
              This is similar to no action, but the restrict check cannot be deferred till later in
              the transaction
            </TooltipContent>
          </Tooltip>
          : {actionVerb} a record from{' '}
          <code className="text-xs text-foreground-light">{reference}</code> will{' '}
          <span className="text-amber-900 opacity-75">prevent {actionVerb.toLowerCase()}</span>{' '}
          existing referencing rows from this table.
        </>
      )
    case FOREIGN_KEY_CASCADE_ACTION.SET_DEFAULT:
      return (
        <>
          <span className="text-foreground-light">{actionName}</span>: {actionVerb} a record from{' '}
          <code className="text-xs text-foreground-light">{reference}</code> will set the value of
          any existing records in this table referencing it to their{' '}
          <span className="text-amber-900 opacity-75">default value</span>
        </>
      )
    case FOREIGN_KEY_CASCADE_ACTION.SET_NULL:
      return (
        <>
          <span className="text-foreground-light">{actionName}</span>: {actionVerb} a record from{' '}
          <code className="text-xs text-foreground-light">{reference}</code> will set the value of
          any existing records in this table referencing it{' '}
          <span className="text-amber-900 opacity-75">to NULL</span>
        </>
      )
  }
}
