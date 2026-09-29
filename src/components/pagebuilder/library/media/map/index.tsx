import { MapPin } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";

interface MapProps { address: string }

const MapComponent: ComponentDefinition<MapProps> = {
    title: "Map",
    group: "Media",
    icon: MapPin,
    tag: "media",
    label: "Map",
    defaultProps: () => ({ address: "New York, NY" }),
    fields: [{ key: "address", kind: "text", label: "Address" }],
    render: ({ props }) => (
        <iframe className="pb-el-map" src={`https://maps.google.com/maps?q=${encodeURIComponent(props.address)}&output=embed`} />
    ),
    renderStatic: (props) =>
        `<iframe class="pb-el-map" src="https://maps.google.com/maps?q=${encodeURIComponent(props.address)}&output=embed"></iframe>`,
    css: `.pb-el-map { width: 100%; height: 200px; border: none; border-radius: 6px; }`,
};

export default MapComponent;