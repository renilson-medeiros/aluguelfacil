import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    MapPin,
    Bed,
    Bath,
    Car,
    PawPrint,
    Users,
    Baby,
    Maximize,
    Droplets,
    Zap,
    Wifi,
    Flame
} from "lucide-react";
import { Property } from "@/types/property";

interface PropertyInfoProps {
    property: Property;
}

export function PropertyInfo({ property }: PropertyInfoProps) {
    return (
        <div className="animate-fade-in">
            <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                {property.title}
            </h1>
            <div className="mt-2 flex items-baseline gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-tertiary" aria-hidden="true" />
                <span>
                    {property.address.street}, {property.address.number}
                    {property.address.complement && ` - ${property.address.complement}`}, {property.address.neighborhood}, {property.address.city} - {property.address.state}
                </span>
            </div>

            {/* Quick Info */}
            <div className="mt-6 flex flex-wrap gap-3">
                {property.details.bedrooms !== null && property.details.bedrooms > 0 && (
                    <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                        <Bed className="h-4 w-4" aria-hidden="true" />
                        {property.details.bedrooms} quartos
                    </Badge>
                )}
                {property.details.bathrooms !== null && property.details.bathrooms > 0 && (
                    <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                        <Bath className="h-4 w-4" aria-hidden="true" />
                        {property.details.bathrooms} banheiros
                    </Badge>
                )}
                {property.details.area !== null && property.details.area > 0 && (
                    <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                        <Maximize className="h-4 w-4" aria-hidden="true" />
                        {property.details.area}m²
                    </Badge>
                )}
                {property.details.garage && (
                    <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                        <Car className="h-4 w-4" aria-hidden="true" />
                        {property.details.garageSpots} vaga{property.details.garageSpots > 1 ? 's' : ''}
                    </Badge>
                )}
            </div>

            {property.rooms.length > 0 && (
                <>
                    <Separator className="my-8" />
                    <div>
                        <h2 className="font-display text-xl font-semibold">Cômodos</h2>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {property.rooms.map((room) => (
                                <Badge key={room} variant="outline" className="px-3 py-1.5 capitalize">
                                    {room}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </>
            )}

            <Separator className="my-8" />

            {/* Rules & Policies */}
            <div>
                <h2 className="font-display text-xl font-semibold">Regras e políticas</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${property.details.acceptsPets ? 'bg-tertiary/10' : 'bg-red-600/10'}`}>
                            <PawPrint className={`h-5 w-5 ${property.details.acceptsPets ? 'text-tertiary' : 'text-red-600'}`} aria-hidden="true" />
                        </div>
                        <span>{property.details.acceptsPets ? 'Aceita pets' : 'Não aceita pets'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${property.details.acceptsChildren ? 'bg-tertiary/10' : 'bg-red-600/10'}`}>
                            <Baby className={`h-5 w-5 ${property.details.acceptsChildren ? 'text-tertiary' : 'text-red-600'}`} aria-hidden="true" />
                        </div>
                        <span>{property.details.acceptsChildren ? 'Aceita crianças' : 'Não aceita crianças'}</span>
                    </div>
                    {property.details.maxPeople !== null && property.details.maxPeople > 0 && (
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600/10">
                                <Users className="h-5 w-5 text-green-600" aria-hidden="true" />
                            </div>
                            <span>Máximo {property.details.maxPeople} pessoas</span>
                        </div>
                    )}
                </div>
            </div>

            <Separator className="my-8" />

            {/* Included */}
            <div>
                <h2 className="font-display text-xl font-semibold">Incluso no valor</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${property.included.water ? 'bg-tertiary/10' : 'bg-red-600/10'}`}>
                            <Droplets className={`h-5 w-5 ${property.included.water ? 'text-tertiary' : 'text-red-600'}`} aria-hidden="true" />
                        </div>
                        <span className={property.included.water ? '' : 'text-muted-foreground'}>
                            Água {property.included.water ? 'inclusa' : 'não inclusa'}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${property.included.electricity ? 'bg-tertiary/10' : 'bg-red-600/10'}`}>
                            <Zap className={`h-5 w-5 ${property.included.electricity ? 'text-tertiary' : 'text-red-600'}`} aria-hidden="true" />
                        </div>
                        <span className={property.included.electricity ? '' : 'text-muted-foreground'}>
                            Luz {property.included.electricity ? 'inclusa' : 'não inclusa'}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${property.included.internet ? 'bg-tertiary/10' : 'bg-red-600/10'}`}>
                            <Wifi className={`h-5 w-5 ${property.included.internet ? 'text-tertiary' : 'text-red-600'}`} aria-hidden="true" />
                        </div>
                        <span className={property.included.internet ? '' : 'text-muted-foreground'}>
                            Internet {property.included.internet ? 'inclusa' : 'não inclusa'}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${property.included.gas ? 'bg-tertiary/10' : 'bg-red-600/10'}`}>
                            <Flame className={`h-5 w-5 ${property.included.gas ? 'text-tertiary' : 'text-red-600'}`} aria-hidden="true" />
                        </div>
                        <span className={property.included.gas ? '' : 'text-muted-foreground'}>
                            Gás {property.included.gas ? 'incluso' : 'não incluso'}
                        </span>
                    </div>
                </div>
            </div>

            {property.observations && (
                <>
                    <Separator className="my-8" />
                    <div>
                        <h2 className="font-display text-xl font-semibold">Observações</h2>
                        <p className="mt-4 text-muted-foreground leading-relaxed whitespace-pre-line">
                            {property.observations}
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}
