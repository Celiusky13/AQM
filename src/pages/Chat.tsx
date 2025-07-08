
import React from 'react';
import Header from '@/components/Header';
import RealtimeChat from '@/components/RealtimeChat';

const Chat = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold pride-text mb-2">
            Chat Comunitario 💬
          </h1>
          <p className="text-gray-600">
            Conecta y conversa con la comunidad en tiempo real
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <RealtimeChat />
        </div>
      </div>
    </div>
  );
};

export default Chat;
