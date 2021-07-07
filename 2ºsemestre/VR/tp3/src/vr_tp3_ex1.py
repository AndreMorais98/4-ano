
from pox.core import core                     # Main POX object
import pox.openflow.libopenflow_01 as of      # OpenFlow 1.0 library
import pox.lib.packet as pkt                  # Packet parsing/construction
from pox.lib.addresses import EthAddr, IPAddr # Address types
import pox.lib.util as poxutil                # Various util functions
import pox.lib.revent as revent               # Event library
import pox.lib.recoco as recoco               # Multitasking library

log = core.getLogger()



class ClassTest (object):
 
  def __init__ (self, connection):
    # Keep track of the connection to the switch so that we can
    # send it messages!
    self.connection = connection

    # This binds our PacketIn event listener
    connection.addListeners(self)

    # Use this table to keep track of which ethernet address is on
    # which switch port (keys are MACs, values are ports).
    self.mac_to_port = {}
    #dict to save packets splited before join them and resend
    self.packets_to_send = {}


  def resend_packet (self, packet_in, out_port):
    """
    Instructs the switch to resend a packet that it had sent to us.
    "packet_in" is the ofp_packet_in object the switch had sent to the
    controller due to a table-miss.
    """
    msg = of.ofp_packet_out()
    msg.data = packet_in
    # Add an action to send to the specified port
    action = of.ofp_action_output(port = out_port)
    msg.actions.append(action)

    # Send message to switch
    self.connection.send(msg)


  def process_packet (self, packet, packet_in):
    #With the parsed packet we can obtain the src Mac Adress, then with packet_in, we obtain it's port
    print(packet)
    in_mac = packet.src
    in_port = packet_in.in_port
    #Add Mac Adress and Port to dict mac_to_port
    if str(in_mac) not in self.mac_to_port:
      print('Adicionei -> ' + str(in_mac) + ' porta ' + str(in_port))
      self.mac_to_port[str(in_mac)] = in_port
    #Create a ofp_match to get destination Mac
    my_match = of.ofp_match.from_packet(packet_in)
    #Retrive dest mac
    dest_mac = my_match.dl_dst
    #Try to find port in mac to port
    print('Mac de destino ->' + str(dest_mac))
    if str(dest_mac) in self.mac_to_port:
      print('Encontrei! Vou enviar para -> ' + str(dest_mac))
      out_port = self.mac_to_port.get(str(dest_mac))
      if (len(packet_in.data) == packet_in.total_len):
        self.resend_create_flow(packet_in,out_port)
      else:
        if packet_in.buffer_id in self.packets_to_send:
          packet_to_send = self.packets_to_send.get(packet_in.buffer_id).data.append(packet_in.data)
          if (len(packet_to_send.data) == packet_to_send.total_len):
            self.resend_create_flow(packet_to_send,out_port)
            self.packets_to_send.pop(packet_in.buffer_id)
        else:
          self.packets_to_send[packet_in.buffer_id] = packet_in  
    else:
      # We want to output to all ports -- we do that using the special
      # OFPP_ALL port as the output port.  (We could have also used
      # OFPP_FLOOD.)'''
      self.resend_packet(packet_in, of.OFPP_ALL)
    # Note:
    # a good implementation would check that we got the full data before
    # sending it (len(packet_in.data) should be == packet_in.total_len)) 
    # using buffer_id to mount the fragments again.

  def resend_create_flow(self,packet_in,out_port):
    self.resend_packet(packet_in,out_port)
    ofp_flow_mod = of.ofp_flow_mod()
    ofp_flow_mod.actions.append(of.ofp_action_output(port = out_port))
    self.resend_packet(packet_in,out_port)

  def _handle_PacketIn (self, event):
    """
    Handles packet in messages from the switch.
    """

    packet = event.parsed # This is the parsed packet data.
    if not packet.parsed:
      log.warning("Ignoring incomplete packet")
      return

    packet_in = event.ofp # The actual ofp_packet_in message.

    self.process_packet(packet, packet_in)


def launch ():
  """
  Starts the component
  """
  def start_switch (event):
    log.debug("Controlling %s" % (event.connection,))
    ClassTest(event.connection)
  core.openflow.addListenerByName("ConnectionUp", start_switch)
