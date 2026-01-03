import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Registration } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, mobile, profession } = body;

    if (!name || !mobile) {
      return NextResponse.json(
        { error: 'Name and mobile are required' },
        { status: 400 }
      );
    }

    const registration: Omit<Registration, 'id'> = {
      name,
      mobile,
      profession: profession || '',
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, 'registrations'), registration);

    return NextResponse.json({
      success: true,
      id: docRef.id,
      registration,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const q = query(collection(db, 'registrations'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const registrations: Registration[] = [];
    querySnapshot.forEach((doc) => {
      registrations.push({
        id: doc.id,
        ...doc.data(),
      } as Registration);
    });

    return NextResponse.json({ registrations });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}