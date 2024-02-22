import { format } from "date-fns";
import Header from "../_components/header";
import { ptBR } from "date-fns/locale";
import Search from "./_components/search";
import {db} from "../_lib/prisma"
import BarberShopItem from "./_components/barbershop-item";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import BookingItem from "../_components/booking-item";

export default async function Home() {
  const session = await getServerSession(authOptions)

  const [barbershops, confirmedBookings] = await Promise.all([
    db.barbershop.findMany({}),
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
        <h2 className="text-xl font-bold ">Olá, Gabriel</h2>
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
              <BarberShopItem key={barbershop.id} barbershop={barbershop}/>
          ))}
        </div>
      </div>

      <div className="mt-6 mb-72">
        <h2 className="px-5 text-xs uppercase text-gray-400 font-bold mb-3">Populares</h2>

        <div className="flex gap-2 px-5 overflow-x-auto [&::-webkit-scrollbar]:hidden ">
          {barbershops.map((barbershop) => (
              <BarberShopItem key={barbershop.id} barbershop={barbershop}/>
          ))}
        </div>
      </div>
   </div>
  );
}

