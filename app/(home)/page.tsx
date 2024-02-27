import { format } from "date-fns";
import Header from "../_components/header";
import { ptBR } from "date-fns/locale";
import Search from "./_components/search";
import {db} from "../_lib/prisma"
import BarberShopItem from "./_components/barbershop-item";
import { getServerSession } from "next-auth";
import BookingItem from "../_components/booking-item";
import { authOptions } from "../_lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions)

  const [barbershops,recomendedBarbershops, confirmedBookings] = await Promise.all([
    db.barbershop.findMany({}),
    db.barbershop.findMany({
      orderBy:{
        id: 'asc'
      }
    }),
    session?.user ? db.booking.findMany({
      where: {
        userId: (session.user as any).id,
        date: {
          gte: new Date()
        }
      },
      include: {
        service: true,
        barbershop: true
      }
    }) : Promise.resolve([])
  ])

  return (
   <div>
      <Header/>
      <div className="px-5 pt-5">
        <h2 className="text-xl font-bold mb-1">
          {session?.user ? `Olá, ${session.user.name?.split(" ")[0]}!` : "Olá, vamos agendar um corte hoje?"}
        </h2>
        <p className="capitalize text-sm">
          {format(new Date(), "EEEE',' dd 'de' MMMM", {locale: ptBR})}
        </p>
      </div>

      <div className="px-5 mt-6">
        <Search/>
      </div>

      <div className="mt-6">
        {confirmedBookings.length > 0 && (
          <>
            <h2 className="pl-5 text-xs uppercase text-gray-400 font-bold mb-3">Agendamentos</h2>
            <div className=" px-5 mt-6 flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {confirmedBookings.map((booking) => (
                <BookingItem key={booking.id} booking={booking}/>
                )
              )}
            </div>
          </>
        
        )}
        
        
      </div>

      <div className="mt-6">
        <h2 className="px-5 text-xs uppercase text-gray-400 font-bold mb-3">Recomendados</h2>

        <div className="flex gap-2 px-5 overflow-x-auto [&::-webkit-scrollbar]:hidden ">
          {barbershops.map((barbershop) => (
            <div key={barbershop.id} className="min-w-[167px] max=w-[167px]">
              <BarberShopItem barbershop={barbershop}/>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 mb-72">
        <h2 className="px-5 text-xs uppercase text-gray-400 font-bold mb-3">Populares</h2>

        <div className="flex gap-2 px-5 overflow-x-auto [&::-webkit-scrollbar]:hidden ">
          {recomendedBarbershops.map((barbershop) => (
            <div key={barbershop.id} className="min-w-[167px] max=w-[167px]">
              <BarberShopItem barbershop={barbershop}/>
            </div>
          ))}
        </div>
      </div>
   </div>
  );
}

