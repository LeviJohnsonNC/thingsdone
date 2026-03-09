import { useIsMobile } from "@/hooks/use-mobile";
import { ItemEditor } from "./ItemEditor";
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer";
import { useAppStore } from "@/stores/appStore";

interface ItemEditorDrawerProps {
  itemId: string;
}

export function ItemEditorDrawer({ itemId }: ItemEditorDrawerProps) {
  const isMobile = useIsMobile();
  const setEditingItemId = useAppStore((s) => s.setEditingItemId);

  if (!isMobile) {
    return <ItemEditor itemId={itemId} />;
  }

  return (
    <Drawer
      open={true}
      onOpenChange={(open) => {
        if (!open) setEditingItemId(null);
      }}
    >
      <DrawerContent className="max-h-[85vh]">
        <div className="overflow-y-auto px-1 pb-6">
          <ItemEditor itemId={itemId} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
